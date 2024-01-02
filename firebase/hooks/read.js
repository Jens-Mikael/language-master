import { doc, getDoc, query } from "firebase/firestore";
import { firestore } from "../firebase-init";

export const getUserInfo = async (uid) => {
  const docRef = doc(firestore, `users/${uid}`);
  try {
    const docSnap = await getDoc(docRef);
    return docSnap.data().userInfo;
  } catch (error) {
    return error;
  }
};
