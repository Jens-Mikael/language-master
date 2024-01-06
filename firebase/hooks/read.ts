import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firestore } from "../firebase-init";
import { IUserInfo } from "../../utils/declarations";

export const getUserInfo = async (uid: string): Promise<IUserInfo> => {
  const docRef = doc(firestore, `users/${uid}`);
  try {
    const docSnap = await getDoc(docRef);
    return docSnap?.data()?.userInfo;
  } catch (error: any) {
    return error;
  }
};

export const getEveryUser = async (): Promise<IUserInfo[]> => {
  const userCollection = collection(firestore, `users`);
  const arr: IUserInfo[] = [];
  const userDocs = await getDocs(userCollection);
  userDocs.forEach((doc) => {
    const data = doc.data();
    arr.push({
      displayName: data.userInfo.displayName,
      photoURL: data.userInfo.photoURL,
      id: doc.id,
    });
  });
  return arr;
};
