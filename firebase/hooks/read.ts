import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firestore } from "../firebase-init";
import { IUserDisplayInfo, IuserInfo } from "../../declarations";

export const getUserInfo = async (uid: string): Promise<IuserInfo> => {
  const docRef = doc(firestore, `users/${uid}`);
  try {
    const docSnap = await getDoc(docRef);
    return docSnap?.data()?.userInfo;
  } catch (error: any) {
    return error;
  }
};

export const getEveryUser = async (): Promise<IUserDisplayInfo[]> => {
  const userCollection = collection(firestore, `users`);
  const arr: IUserDisplayInfo[] = [];
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
