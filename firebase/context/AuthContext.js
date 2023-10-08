"use client";
import { auth } from "../firebase-init";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
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
    logout,
    loading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
