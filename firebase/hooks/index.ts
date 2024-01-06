import { IsetCard, ILibraryCard, IStudySet } from "../../declarations";
import { firestore } from "../firebase-init";
import {
  getDoc,
  doc,
  addDoc,
  setDoc,
  deleteField,
  writeBatch,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  collection,
  getDocs,
  updateDoc,
  orderBy,
  serverTimestamp,
  query,
  where,
  limit,
  DocumentData,
} from "firebase/firestore";

export const isUsernameAvailable = async (
  username: string
): Promise<boolean | unknown> => {
  const docRef = doc(firestore, `usernames/${username}`);
  try {
    const docSnap = await getDoc(docRef);
    return !docSnap.exists();
  } catch (err: unknown) {
    return err;
  }
};

const createStudyDraft = async (uid: string): Promise<string | undefined> => {
  const userDocRef = doc(firestore, `users/${uid}`);
  try {
    const userDocSnap = await getDoc(userDocRef);
    //if a draft exists, return ID
    if (userDocSnap.exists()) {
      const draftId = userDocSnap.data().studySets.draft;
      if (draftId !== "") return draftId;
    }
    //create a new draft
    const docRef = await addDoc(collection(firestore, "studySets"), {
      creator: uid,
      head: { title: "", description: "" },
      timestamp: serverTimestamp(),
    });
    const draftId = docRef.id;
    const draftbodyCollection = collection(
      firestore,
      `studySets/${draftId}/body`
    );
    await addDoc(draftbodyCollection, {
      term: "",
      definition: "",
      timestamp: serverTimestamp(),
    });
    await addDoc(draftbodyCollection, {
      term: "",
      definition: "",
      timestamp: serverTimestamp(),
    });
    await addDoc(draftbodyCollection, {
      term: "",
      definition: "",
      timestamp: serverTimestamp(),
    });

    //add draft to users studySets
    const res = await setDoc(
      userDocRef,
      {
        studySets: {
          draft: draftId,
        },
      },
      { merge: true }
    );
    return draftId;
  } catch (error: unknown) {
    console.log(error);
  }
};

export const getStudyDraft = async (uid: string) => {
  //get draft id and if it doesn't exist, create one
  const draftId = await createStudyDraft(uid);

  //get studyDraft
  const studyDraftRef = doc(firestore, `studySets/${draftId}`);

  const bodyCollectionRef = collection(firestore, `studySets/${draftId}/body`);
  const docQuery = query(bodyCollectionRef, orderBy("timestamp", "asc"));
  const body: { [key: string]: DocumentData } = {};
  try {
    const studyDraftSnap = await getDoc(studyDraftRef);
    const docsSnap = await getDocs(docQuery);

    if (studyDraftSnap.exists()) {
      const data = studyDraftSnap.data();
      docsSnap.forEach((doc) => {
        body[doc.id] = doc.data();
      });
      return {
        body,
        head: data.head,
        creator: data.creator,
        id: draftId,
      };
    }
  } catch (error) {
    return error;
  }
};

export const getUserLibrary = async (uid: string): Promise<ILibraryCard[]> => {
  const userDocRef = doc(firestore, `users/${uid}`);

  try {
    const userDocSnap = await getDoc(userDocRef);
    const createdSets = userDocSnap.data()?.studySets.created;
    const setsQuery = query(
      collection(firestore, `studySets`),
      where("__name__", "in", createdSets)
    );
    const arr: ILibraryCard[] = [];
    const docsSnap = await getDocs(setsQuery);
    docsSnap.forEach((doc) => {
      const data = doc.data();
      arr.push({
        title: data.head.title,
        description: data.head.description,
        id: doc.id,
        creator: data.creator,
      });
    });
    return arr;
  } catch (err: any) {
    return err;
  }
};

export const getStudySet = async (id: string): Promise<IStudySet> => {
  const docRef = doc(firestore, `studySets/${id}`);
  const bodyCollectionRef = collection(firestore, `studySets/${id}/body`);
  const body: { [key: string]: DocumentData } = {};
  const docQuery = query(bodyCollectionRef, orderBy("timestamp", "asc"));
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  const docsSnap = await getDocs(docQuery);
  docsSnap.forEach((doc) => {
    body[doc.id] = doc.data();
  });
  return {
    body,
    head: data?.head,
    creator: data?.creator,
    id,
    isPublic: data?.isPublic,
  };
};

export const mutateStudySet = (
  type: string,
  cardId: string,
  value: string,
  setId: string
) => {
  //body
  try {
    if (type === "term" || type === "definition") {
      const collectionDocRef = doc(
        firestore,
        `studySets/${setId}/body/${cardId}`
      );
      return setDoc(collectionDocRef, { [type]: value }, { merge: true });
    } else if (type === "title" || type === "description") {
      const docRef = doc(firestore, `studySets/${setId}`);
      return setDoc(
        docRef,
        {
          head: {
            [type]: value,
          },
        },
        { merge: true }
      );
    }

    return;
  } catch (error: unknown) {
    return error;
  }
};

export const mutateStudyCardAmount = async (
  type: string,
  cardId: string,
  setId: string
) => {
  const collectionRef = collection(firestore, `studySets/${setId}/body`);
  try {
    if (type === "add") {
      return addDoc(collectionRef, {
        definition: "",
        term: "",
        timestamp: serverTimestamp(),
      });
    } else if (type === "remove") {
      const cardDocRef = doc(firestore, `studySets/${setId}/body/${cardId}`);
      return deleteDoc(cardDocRef);
    } else {
      console.log("else ran in mutateCardAmount");
    }
  } catch (error: unknown) {
    console.log(error);
    return error;
  }
};

export const submitStudySet = (id: string, uid: string) => {
  const userDocRef = doc(firestore, `users/${uid}`);
  try {
    return setDoc(
      userDocRef,
      {
        studySets: {
          draft: "",
          created: arrayUnion(id),
        },
      },
      { merge: true }
    );
  } catch (error) {
    return error;
  }
};

export const deleteStudySet = async (id: string, uid: string) => {
  const studySetRef = doc(firestore, `studySets/${id}`);
  const userRef = doc(firestore, `users/${uid}`);
  try {
    await setDoc(
      userRef,
      {
        studySets: {
          created: arrayRemove(id),
        },
      },
      { merge: true }
    );
    return deleteDoc(studySetRef);
  } catch (error) {
    return error;
  }
};

export const setToCollection = async (id: string) => {
  const studyDocSnap = doc(firestore, `studySets/${id}`);
  console.log(id);

  try {
    const docSnap = await getDoc(studyDocSnap);
    const bodyData = docSnap.data()?.body;

    Object.keys(bodyData).forEach(async (index) => {
      const collectionRef = collection(firestore, `studySets/${id}/body`);
      console.log(bodyData[index].definition);
      await addDoc(collectionRef, {
        definition: bodyData[index].definition,
        term: bodyData[index].term,
        timestamp: serverTimestamp(),
      });
    });
    await updateDoc(studyDocSnap, { body: deleteField() });
    return "success";
  } catch (error: unknown) {
    console.log(error);
    return error;
  }
};

export const addTimestamp = async (id: string) => {
  const batch = writeBatch(firestore);
  const collectionRef = collection(firestore, `studySets/${id}/body`);
  try {
    const arr: string[] = [];
    const docsSnap = await getDocs(collectionRef);
    docsSnap.forEach(async (doc) => {
      arr.push(doc.id);
    });
    arr.forEach((key) => {
      const docRef = doc(firestore, `studySets/${id}/body/${key}`);
      console.log(docRef);
      batch.set(docRef, { timestamp: serverTimestamp() }, { merge: true });
    });

    return batch.commit();
  } catch (error: unknown) {
    console.log(error);
    return error;
  }
};

export const editPublicity = async (id: string, isPublic: boolean) => {
  const docRef = doc(firestore, `studySets/${id}`);
  console.log(isPublic);
  try {
    return updateDoc(docRef, { isPublic: isPublic });
  } catch (error) {
    return error;
  }
};

export const getPublicSets = async (): Promise<ILibraryCard[]> => {
  const docsQuery = query(
    collection(firestore, "studySets"),
    where("isPublic", "==", true)
  );
  const arr: ILibraryCard[] = [];
  const docsSnap = await getDocs(docsQuery);
  docsSnap.forEach((doc) => {
    const data = doc.data();
    arr.push({
      title: data.head.title,
      description: data.head.description,
      id: doc.id,
      creator: data.creator,
    });
  });
  return arr;
};

export const getStudySetsCreators = async (uids: string[] | undefined) => {
  const setsQuery = query(
    collection(firestore, `users`),
    where("__name__", "in", uids)
  );
  const obj: { [key: string]: Object } = {};

  try {
    const docs = await getDocs(setsQuery);
    docs.forEach((doc) => {
      const userInfo = doc.data().userInfo;
      obj[doc.id] = {
        displayName: userInfo.displayName,
        photoURL: userInfo.photoURL,
      };
    });
    return obj;
  } catch (error: unknown) {
    return error;
  }
};
