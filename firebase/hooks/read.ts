import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firestore } from "../firebase-init";
import { ILibraryCard, IUserInfo } from "../../utils/declarations";
import { timestampSort } from "@utils/functions";

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

export const getUserArchive = async (uid: string): Promise<ILibraryCard[]> => {
  const userDocRef = doc(firestore, `users/${uid}`);
  const studySetsColl = collection(firestore, `studySets`);
  const docSnap = await getDoc(userDocRef);
  const data = docSnap.data();
  if (!data?.studySets?.archive || data?.studySets?.archive?.length <= 0)
    return [];
  const docsSnap = await getDocs(studySetsColl);
  const arr: ILibraryCard[] = [];
  docsSnap.forEach((doc) => {
    const data = doc.data();
    arr.push({
      title: data.title,
      description: data.description,
      id: doc.id,
      creator: data.creator,
      timestamp: data.timestamp,
    });
  });
  arr.sort((a, b) => timestampSort(a, b));
  return arr;
};
