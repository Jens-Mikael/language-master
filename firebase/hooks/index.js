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
} from "firebase/firestore";

export const isUsernameAvailable = async (username) => {
  const docRef = doc(firestore, `usernames/${username}`);
  try {
    const docSnap = await getDoc(docRef);
    return !docSnap.exists();
  } catch (err) {
    console.log(err.message);
  }
};

export const addUsername = async (username) => {};

const createStudyDraft = async (uid) => {
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
    await addDoc(
      draftbodyCollection,
      {
        term: "",
        definition: "",
        timestamp: serverTimestamp(),
      },
      { merge: true }
    );
    await addDoc(
      draftbodyCollection,
      {
        term: "",
        definition: "",
        timestamp: serverTimestamp(),
      },
      { merge: true }
    );
    await addDoc(
      draftbodyCollection,
      {
        term: "",
        definition: "",
        timestamp: serverTimestamp(),
      },
      { merge: true }
    );

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
  } catch (error) {
    console.log(error.message);
  }
};

export const getStudyDraft = async (uid) => {
  //get draft id and if it doesn't exist, create one
  const draftId = await createStudyDraft(uid);

  //get studyDraft
  const studyDraftRef = doc(firestore, `studySets/${draftId}`);

  const bodyCollectionRef = collection(firestore, `studySets/${draftId}/body`);
  const docQuery = query(bodyCollectionRef, orderBy("timestamp", "asc"));
  const body = {};
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

export const getLibrarySets = async (uid) => {
  const userDocRef = doc(firestore, `users/${uid}`);

  try {
    const userDocSnap = await getDoc(userDocRef);
    const createdSets = userDocSnap.data().studySets.created;
    const setsQuery = query(
      collection(firestore, `studySets`),
      where("__name__", "in", createdSets)
    );
    const arr = [];
    const docsSnap = await getDocs(setsQuery);
    docsSnap.forEach((doc) => {
      const data = doc.data();
      arr.push({
        title: data.head.title,
        id: doc.id,
        creator: data.creator,
      });
    });
    return arr;
  } catch (err) {
    return err;
  }
};

export const getStudySet = async (id) => {
  const docRef = doc(firestore, `studySets/${id}`);
  const bodyCollectionRef = collection(firestore, `studySets/${id}/body`);
  const body = {};
  try {
    const docQuery = query(bodyCollectionRef, orderBy("timestamp", "asc"));
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const docsSnap = await getDocs(docQuery);
    docsSnap.forEach((doc) => {
      body[doc.id] = doc.data();
    });
    return { body, head: data.head, creator: data.creator, id };
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

export const mutateStudySet = (type, cardId, value, setId) => {
  console.log(cardId);
  //body
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
  } else {
    console.log("else ran in mutateStudySet");
  }
  console.log("mutation ran");

  return;
};

export const mutateStudyCardAmount = async (type, cardId, setId) => {
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
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

export const submitStudySet = (id, uid) => {
  const userDocRef = doc(firestore, `users/${uid}`);
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
};

export const deleteStudySet = async (id, uid) => {
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

export const setToCollection = async (id) => {
  const studyDocSnap = doc(firestore, `studySets/${id}`);
  console.log(id);

  try {
    const docSnap = await getDoc(studyDocSnap);
    const bodyData = docSnap.data().body;

    Object.keys(bodyData).forEach(async (index) => {
      const collectionRef = collection(firestore, `studySets/${id}/body`);
      console.log(bodyData[index].definition);
      await addDoc(
        collectionRef,
        {
          definition: bodyData[index].definition,
          term: bodyData[index].term,
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );
    });
    await updateDoc(studyDocSnap, { body: deleteField() });
    return "success";
  } catch (error) {
    return error.message;
  }
};

export const addTimestamp = async (id) => {
  const batch = writeBatch(firestore);
  const collectionRef = collection(firestore, `studySets/${id}/body`);
  try {
    const arr = [];
    const docsSnap = await getDocs(collectionRef);
    docsSnap.forEach(async (doc) => {
      arr.push(doc.id);
    });
    arr.forEach((key) => {
      const docRef = doc(firestore, `studySets/${id}/body/${key}`);
      console.log(docRef);
      batch.set(docRef, { timestamp: serverTimestamp() }, { merge: true });
    });

    await batch.commit();
    return "success";
  } catch (error) {
    return error.message;
  }
};
