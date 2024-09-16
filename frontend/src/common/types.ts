import { Timestamp } from "firebase/firestore";
import { IUserData } from "../pages/Login/types";

export interface IRoomData {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdAt: Timestamp;
}

type TUserExtend = Pick<IUserData, 'photoURL' | 'uid' | 'displayName'>;

export interface IMessageData {
  id: string;
  content: string;
  user: TUserExtend;
  roomID: string;
  createdAt: Timestamp;
}
