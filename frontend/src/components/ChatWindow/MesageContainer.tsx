import { QueryConstraint, where } from "firebase/firestore";
import useStore from "../../stores";
import Message from "./Message"
import { useMemo } from "react";
import { usePaginatedFirestoreCollection } from "../../hooks/useFirebaseStoreCollection";
import collections from "../../common/collections";
import { IMessageData } from "../../common/types";

const MesageContainer = () => {
  const { currentRoomInfo } = useStore();
  
  const conditions: QueryConstraint[] = useMemo(() => {

    return [where("roomID", "==", currentRoomInfo.id)];
  }, [currentRoomInfo.id]);

  const { data: messages } = usePaginatedFirestoreCollection<IMessageData>(
    collections.messages,
    conditions
  );


  return (
   <ul className="chat-message__list">
        {messages.map((item) => (<Message key={item.id} data={item} />))}
    </ul>
  )
}

export default MesageContainer