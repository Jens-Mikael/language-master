"use client";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/firebase/context/AuthContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
            {/* <ReactQueryDevtools /> */}
          </QueryClientProvider>
        </AuthProvider>
      </>
    );
  return (
    <>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class">{children}</ThemeProvider>
          {/* <ReactQueryDevtools /> */}
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
};

export default Providers;
