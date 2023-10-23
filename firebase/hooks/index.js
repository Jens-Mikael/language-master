import { firestore } from "../firebase-init";
import {
  getDoc,
  doc,
  collection,
  addDoc,
  setDoc,
  deleteField,
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
          created: [],
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

export const mutateStudySet = async (type, index, value, id) => {
  const docRef = doc(firestore, `studySets/${id}`);

  //body
  if (type === "term" || type === "definition") {
    await setDoc(
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
    await setDoc(
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

export const mutateStudyCardAmount = async (type, index, id) => {
  const docRef = doc(firestore, `studySets/${id}`);
  if (type === "add") {
    return await setDoc(
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
    await setDoc(
      docRef,
      {
        body: {
          [index]: deleteField(),
        },
      },
      { merge: true }
    );
    return;
  } else {
    console.log("else ran in mutateCardAmount");
  }
  console.log("mutation ran in cardAmount");
};
