import { firestore } from "../firebase-init";
import { getDoc, doc, collection, addDoc, setDoc } from "firebase/firestore";

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
    console.log("should not run");
    //create a new draft
    const docRef = await addDoc(collection(firestore, "studySets"), {
      creator: uid,
      head: {
        title: "",
        description: "",
      },
      body: [
        {
          term: "",
          definition: "",
        },
        {
          term: "",
          definition: "",
        },
        {
          term: "",
          definition: "",
        },
      ],
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

  console.log("hook ran");
  const studyDraftSnap = await getDoc(studyDraftRef);
  if (studyDraftSnap.exists()) {
    console.log();
    return studyDraftSnap.data();
  }
};

export const mutateStudySet = async (type, index, value) => {};
