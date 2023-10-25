import { firestore } from "../firebase-init";
import {
  getDoc,
  doc,
  collection,
  addDoc,
  setDoc,
  deleteField,
  writeBatch,
  arrayUnion,
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
      head: {
        title: "",
        description: "",
      },
      body: {
        1: {
          term: "",
          definition: "",
        },
        2: {
          term: "",
          definition: "",
        },
        3: {
          term: "",
          definition: "",
        },
      },
    });
    const draftId = docRef.id;

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

  console.log("fetch data ran");
  const studyDraftSnap = await getDoc(studyDraftRef);
  if (studyDraftSnap.exists()) {
    console.log();
    return { data: studyDraftSnap.data(), id: draftId };
  }
};

export const getLibrarySets = async (uid) => {
  const userDocRef = doc(firestore, `users/${uid}`);

  //get user created sets
  const docSnap = await getDoc(userDocRef);
  const createdSets = docSnap.data().studySets.created;

  //loop through created sets
  const dataArr = [];
  for (let i = 0; i < createdSets.length; i++) {
    const studySetRef = doc(firestore, `studySets/${createdSets[i]}`);
    const studyDocSnap = await getDoc(studySetRef);
    dataArr.unshift({
      title: studyDocSnap.data().head.title,
      id: createdSets[i],
      creator: studyDocSnap.data().creator,
    });
  }
  return dataArr;
};

export const getStudySet = async (id) => {
  const docRef = doc(firestore, `studySets/${id}`);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export const mutateStudySet = (type, index, value, id) => {
  const docRef = doc(firestore, `studySets/${id}`);

  //body
  if (type === "term" || type === "definition") {
    return setDoc(
      docRef,
      {
        body: {
          [index]: {
            [type]: value,
          },
        },
      },
      { merge: true }
    );
  } else if (type === "title" || type === "description") {
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

export const mutateStudyCardAmount = (type, index, id) => {
  const docRef = doc(firestore, `studySets/${id}`);
  if (type === "add") {
    return setDoc(
      docRef,
      {
        body: {
          [index]: {
            definition: "",
            term: "",
          },
        },
      },
      { merge: true }
    );
  } else if (type === "remove") {
    console.log("hook ran");
    console.log(index);
    return setDoc(
      docRef,
      {
        body: {
          [index]: deleteField(),
        },
      },
      { merge: true }
    );
  } else {
    console.log("else ran in mutateCardAmount");
  }
  console.log("mutation ran in cardAmount");
  return;
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
