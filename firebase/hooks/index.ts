import { timestampSort } from "@utils/functions";
import {
  ILibraryCard,
  IStudySet,
  ISetCard,
  IUserInfo,
  ICreatorsData,
} from "../../utils/declarations";
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

const createStudyDraft = async (uid: string): Promise<string> => {
  const userDocRef = doc(firestore, `users/${uid}`);

  const userDocSnap = await getDoc(userDocRef);
  //if a draft exists, return ID
  if (userDocSnap.data()?.studySets.draft !== "")
    return userDocSnap.data()?.studySets.draft;
  //create a new draft
  const docRef = await addDoc(collection(firestore, "studySets"), {
    creator: uid,
    head: { title: "", description: "" },
    isPublic: false,
    isArchived: false,
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
};

export const getStudyDraft = async (uid: string): Promise<IStudySet> => {
  //get draft id and if it doesn't exist, create one
  const draftId = await createStudyDraft(uid);

  //get studyDraft
  console.log(draftId);

  const studyDraftRef = doc(firestore, `studySets/${draftId}`);

  const bodyCollectionRef = collection(firestore, `studySets/${draftId}/body`);
  const docQuery = query(bodyCollectionRef, orderBy("timestamp", "asc"));

  const body: { [key: string]: ISetCard } = {};
  const studyDraftSnap = await getDoc(studyDraftRef);
  const docsSnap = await getDocs(docQuery);

  const data = studyDraftSnap.data();
  docsSnap.forEach((doc) => {
    body[doc.id] = {
      definition: doc.data().definition,
      term: doc.data().term,
    };
  });
  return {
    body,
    head: data?.head,
    creator: data?.creator,
    id: draftId,
    isPublic: data?.isPublic,
  };
};

export const getUserLibrary = async (uid: string): Promise<ILibraryCard[]> => {
  const userDocRef = doc(firestore, `users/${uid}`);

  const userDocSnap = await getDoc(userDocRef);
  if (!userDocSnap.exists()) throw new Error("User does not exist");
  const data = userDocSnap.data();
  const createdSets = data?.studySets.created;
  if (createdSets.length <= 0) return [];
  const setsQuery = query(
    collection(firestore, `studySets`),
    where("__name__", "in", createdSets)
  );
  const arr: ILibraryCard[] = [];
  const docsSnap = await getDocs(setsQuery);
  docsSnap.forEach((doc) => {
    const data = doc.data();
    if (!data.isArchieved) {
      arr.push({
        title: data.head.title,
        description: data.head.description,
        id: doc.id,
        creator: data.creator,
        timestamp: data?.timestamp,
        isPublic: data.isPublic,
      });
    }
  });
  arr.sort((a, b) => timestampSort(a, b));
  return arr;
};

export const getStudySet = async (id: string): Promise<IStudySet | null> => {
  const docRef = doc(firestore, `studySets/${id}`);
  const bodyCollectionRef = collection(firestore, `studySets/${id}/body`);
  const body: { [key: string]: ISetCard } = {};
  const docQuery = query(bodyCollectionRef, orderBy("timestamp", "asc"));
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  if (data?.isArchieved) return null;
  const docsSnap = await getDocs(docQuery);
  docsSnap.forEach((doc) => {
    body[doc.id] = {
      definition: doc.data().definition,
      term: doc.data().term,
    };
  });
  console.log("ran read");
  return {
    body,
    head: data?.head,
    creator: data?.creator,
    id,
    isPublic: data?.isPublic,
  };
};

export const mutateStudySet = async (
  type: string,
  cardId: string,
  value: string,
  setId: string
): Promise<string | undefined> => {
  //body
  if (type === "term" || type === "definition") {
    const collectionDocRef = doc(
      firestore,
      `studySets/${setId}/body/${cardId}`
    );
    await setDoc(collectionDocRef, { [type]: value }, { merge: true });
    return "success";
  } else if (type === "title" || type === "description") {
    const docRef = doc(firestore, `studySets/${setId}`);
    await setDoc(
      docRef,
      {
        head: {
          [type]: value,
        },
      },
      { merge: true }
    );
    return "success";
  }
  return;
};

export const mutateStudyCardAmount = async (
  type: string,
  cardId: string | null,
  setId: string
) => {
  const collectionRef = collection(firestore, `studySets/${setId}/body`);
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
};

export const submitStudySet = async (id: string, uid: string) => {
  const userDocRef = doc(firestore, `users/${uid}`);
  const studySetDocRef = doc(firestore, `studySets/${id}`);
  const batch = writeBatch(firestore);

  batch.update(userDocRef, {
    "studySets.draft": "",
    "studySets.created": arrayUnion(id),
  });

  batch.update(studySetDocRef, {
    timestamp: serverTimestamp(),
  });

  return batch.commit();
};

export const deleteStudySet = async (id: string, uid: string) => {
  const studySetRef = doc(firestore, `studySets/${id}`);
  const userRef = doc(firestore, `users/${uid}`);
  await setDoc(
    userRef,
    {
      studySets: {
        created: arrayRemove(id),
        archive: arrayRemove(id),
      },
    },
    { merge: true }
  );
  return deleteDoc(studySetRef);
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
  return updateDoc(docRef, { isPublic: isPublic });
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
      timestamp: data.timestamp,
    });
  });
  return arr;
};

export const getStudySetsCreators = async (
  uids: string[] | undefined
): Promise<ICreatorsData> => {
  const setsQuery = query(
    collection(firestore, `users`),
    where("__name__", "in", uids)
  );
  const obj: ICreatorsData = {};
  const docs = await getDocs(setsQuery);
  docs.forEach((doc) => {
    const userInfo = doc.data().userInfo;
    obj[doc.id] = {
      displayName: userInfo.displayName,
      photoURL: userInfo.photoURL,
      id: doc.id,
    };
  });
  return obj;
};
