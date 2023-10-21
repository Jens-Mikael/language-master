"use client";
import { auth } from "../firebase-init";
import {
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(true);

  //AUTH METHODS

  const googleAuth = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res) {
        const user = res.user;
        return user;
      }
    } catch (err) {
      return err.message;
    }
  };

  const facebookAuth = async () => {
    const facebookProvider = new FacebookAuthProvider();
    try {
      const res = await signInWithPopup(auth, facebookProvider);
      if (res) {
        const user = res.user;
        return user;
      }
    } catch (err) {
      return err.message;
    }
  };

  const githubAuth = async () => {
    const githubProvider = new GithubAuthProvider();
    try {
      const res = await signInWithPopup(auth, githubProvider);
      if (res) {
        const user = res.user;
        return user;
      }
    } catch (err) {
      return err.message;
    }
  };

  const signUp = async (email, password, username) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      return updateProfile(user, { displayName: username });
    } catch (err) {
      console.log(err.message);
    }
  };

  const logIn = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return signOut(auth);
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) setUid(user.uid);
      setLoading(false);
    });
    return;
  }, []);

  const value = {
    currentUser,
    uid,
    googleAuth,
    facebookAuth,
    githubAuth,
    signUp,
    logIn,
    logout,
    loading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
