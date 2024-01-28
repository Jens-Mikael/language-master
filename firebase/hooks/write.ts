import { firestore } from "@firebase/firebase-init";
import {
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

export const writeArchiveSet = async (
  id: string,
  archive: boolean,
  uid: string
) => {
  const studyDocRef = doc(firestore, `studySets/${id}`);
  const userDocRef = doc(firestore, `users/${uid}`);
  const batch = writeBatch(firestore);
  //update studySet
  batch.update(studyDocRef, {
    isArchieved: archive,
    isPublic: !archive,
  });
  //update userDoc
  batch.update(userDocRef, {
    "studySets.archive": archive ? arrayUnion(id) : arrayRemove(id),
    "studySets.created": archive ? arrayRemove(id) : arrayUnion(id),
  });

  return batch.commit();
};
