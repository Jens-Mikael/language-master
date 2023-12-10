import { useAuth } from "@/firebase/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

const AuthPage = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div>loading</div>;
  if (currentUser) router.push("/");

  return <div>
    <AuthPage></AuthPage>
  </div>
};

export default AuthPage;
