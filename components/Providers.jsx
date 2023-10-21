"use client";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider, QueryClient } from "react-query";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/firebase/context/AuthContext";

const Providers = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const queryClient = new QueryClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </AuthProvider>
      </>
    );
  return (
    <>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class">{children}</ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
};

export default Providers;
