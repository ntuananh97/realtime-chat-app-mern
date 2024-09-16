// import { useState } from "react";
import DebounceSelect from "../DebounceSelect";
import {
  collection,
  query,
  orderBy,
  startAt,
  endAt,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import collections from "../../../common/collections";
import { IUserData } from "../../../pages/Login/types";

export interface IUserValueSelect {
  label: string;
  value: string;
}

interface IUserDataExtend extends IUserData {
  id: string;
}

interface UserMultipleSelectProps {
  filterCondition?: (T: IUserValueSelect[]) => IUserValueSelect[];
  onChange?: (value: IUserValueSelect[]) => void;
  value?: IUserValueSelect[];
}

async function fetchUserList(username: string, filterCondition?: UserMultipleSelectProps['filterCondition']): Promise<IUserValueSelect[]> {
  console.log("fetching user", username);

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      const usersRef = collection(db, collections.users);

      // Firestore range query for prefix matching
      const q = query(
        usersRef,
        orderBy("displayName"),
        startAt(username),
        endAt(username + "\uf8ff") // Ensures prefix matching
      );

      const querySnapshot = await getDocs(q);
      const userData: IUserDataExtend[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IUserDataExtend[];

      console.log("userData ~ userData:", userData);
      const valueDatas: IUserValueSelect[] = userData.map((user) => ({
        label: user.displayName as string,
        value: user.uid,
      }));

      const filterValueDatas = filterCondition ? filterCondition(valueDatas) : valueDatas;

      resolve(filterValueDatas);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  });
}

const UserMultipleSelect: React.FC<UserMultipleSelectProps> = ({filterCondition, value, onChange}) => {
  // const [value, setValue] = useState<IUserValueSelect[]>([]);
  return (
    <DebounceSelect
      mode="multiple"
      value={value}
      placeholder="Select users"
      fetchOptions={(search: string) => fetchUserList(search, filterCondition)}
      onChange={(newValue) => {
        onChange?.(newValue as IUserValueSelect[]);
      }}
      style={{ width: "100%" }}
    />
  );
};

export default UserMultipleSelect;
