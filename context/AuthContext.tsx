"use client";
import { auth } from "../firebase/firebase-init";
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
  deleteUser,
  User,
} from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUseAuth } from "../declarations";

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

interface IProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: IProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [uid, setUid] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  //AUTH METHODS

  const googleAuth = async (): Promise<User | unknown> => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res) {
        const user = res.user;
        return user;
      }
    } catch (err) {
      return err;
    }
  };

  const facebookAuth = async (): Promise<User | unknown> => {
    const facebookProvider = new FacebookAuthProvider();
    try {
      const res = await signInWithPopup(auth, facebookProvider);
      if (res) {
        const user = res.user;
        return user;
      }
    } catch (err) {
      return err;
    }
  };

  const githubAuth = async (): Promise<User | unknown> => {
    const githubProvider = new GithubAuthProvider();
    try {
      const res = await signInWithPopup(auth, githubProvider);
      if (res) {
        const user = res.user;
        return user;
      }
    } catch (err) {
      return err;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      return updateProfile(user, { displayName: username });
    } catch (err) {
      console.log(err);
    }
  };

  const logIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return signOut(auth);
  };

  const deleteAccount = async () => {
    return currentUser && deleteUser(currentUser);
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) setUid(user.uid);
      setIsLoading(false);
    });
    return;
  }, []);

  const value: IUseAuth = {
    currentUser,
    uid,
    googleAuth,
    facebookAuth,
    githubAuth,
    signUp,
    logIn,
    logout,
    deleteAccount,
    isLoading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
