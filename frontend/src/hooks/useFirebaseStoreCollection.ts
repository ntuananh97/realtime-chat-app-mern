import { useEffect, useState } from "react";
import {
  collection,
  query,
  limit,
  onSnapshot,
  startAfter,
  orderBy,
  QuerySnapshot,
  DocumentData,
  QueryConstraint
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { PAGE_SIZE } from "../common/pagination";

// Generic type for the collection data
export function usePaginatedFirestoreCollection<T>(
  collectionName: string,
  conditions: QueryConstraint[], // Array of query conditions (like where clauses)
  pageSize?: number
) {
  const [data, setData] = useState<T[]>([]);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchData = (isPagination: boolean = false) => {
    setLoading(true);
    const collectionRef = collection(db, collectionName);

    // Build the query using conditions, orderBy, and pagination
    let q = query(
      collectionRef,
      ...conditions, 
      orderBy("createdAt"),
      limit(pageSize || PAGE_SIZE)
    );

    if (lastVisible && isPagination) {
      q = query(q, startAfter(lastVisible));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const newData: T[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];

        setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // Save last visible for pagination
        setData((prevData) => (isPagination ? [...prevData, ...newData] : newData)); // Append if paginating
        setLoading(false);
        setError(null);
        setIsFetchingMore(false);
      },
      (err) => {
        console.error("Error fetching collection: ", err);
        setError("Failed to fetch data");
        setLoading(false);
        setIsFetchingMore(false);
      }
    );

    return unsubscribe;
  };

  // Initial fetch
  useEffect(() => {
    const unsubscribe = fetchData(false);
    return () => unsubscribe(); // Cleanup on unmount
  }, [collectionName, conditions]); // Re-run if collectionName or conditions change

  // Function to fetch more data (pagination)
  const fetchMore = () => {
    setIsFetchingMore(true);
    fetchData(true);
  };

  // Function to fetch more data (pagination)
  const fetchInitData = () => {
    console.log('run fetchInitData');
    
    fetchData();
  };

  return { data, loading, error, fetchMore, isFetchingMore, fetchInitData };
}
