import { UserCredential } from "firebase/auth";

export interface IUserData {
    displayName: UserCredential['user']['displayName'],
    email: UserCredential['user']['email'],
    photoURL: UserCredential['user']['photoURL'],
    providerId: UserCredential['user']['providerId'],
    uid: UserCredential['user']['uid'] ,
}