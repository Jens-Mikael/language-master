import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
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

export const getUserArchive = async (
  uid: string,
  reqLimit: number
): Promise<ILibraryCard[]> => {
  const userDocRef = doc(firestore, `users/${uid}`);
  const docSnap = await getDoc(userDocRef);
  const data = docSnap.data();
  if (!data?.studySets?.archive || data?.studySets?.archive?.length <= 0)
    return [];
  const studySetsQuery = query(
    collection(firestore, `studySets`),
    where("__name__", "in", data.studySets.archive),
    limit(reqLimit)
  );
  const docsSnap = await getDocs(studySetsQuery);
  const arr: ILibraryCard[] = [];
  docsSnap.forEach((doc) => {
    const data = doc.data();
    arr.push({
      title: data.head.title,
      description: data.head.description,
      id: doc.id,
      creator: data.creator,
      timestamp: data.timestamp,
    });
  });
  arr.sort((a, b) => timestampSort(a, b));
  return arr;
};
