import { collection, doc, getDoc, getDocs } from "firebase/firestore";
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

export const getEveryUser = async () => {
  const userCollection = collection(firestore, `users`);
  const arr = [];
  try {
    const userDocs = await getDocs(userCollection);
    userDocs.forEach((doc) => {
      const data = doc.data();
      arr.push({
        displayName: data.userInfo.displayName,
        photoURL: data.userInfo.photoURL,
        id: doc.id,
      });
    });
    console.log(arr);
    return arr;
  } catch (error) {
    return error.message;
  }
};
