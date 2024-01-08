const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

exports.userCreated = functions.auth.user().onCreate((user) => {
  return admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .set({
      userInfo: {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      studySets: {
        created: [],
        draft: "",
      },
    });
});

exports.userDeleted = functions.auth.user().onDelete((user) => {
  const doc = admin.firestore().collection("users").doc(user.uid);
  return doc.delete();
});
