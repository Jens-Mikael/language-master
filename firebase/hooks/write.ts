import { firestore } from "@firebase/firebase-init";
import { doc, updateDoc, writeBatch } from "firebase/firestore";

export const writeArchiveSet = async (id: string, archive: boolean) => {
  const studyDocRef = doc(firestore, `studySets/${id}`);
  const batch = writeBatch(firestore);
  //update studySet
  return updateDoc(studyDocRef, {
    isArchieved: archive,
    isPublic: !archive,
  });
};
