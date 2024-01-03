"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SearchProvider } from "@/context/SearchContext";

const Providers = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const queryClient = new QueryClient();

  if (!mounted)
    return (
      <>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <SearchProvider>{children}</SearchProvider>
          </QueryClientProvider>
        </AuthProvider>
      </>
    );
  return (
    <>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <SearchProvider>
            {children}
            <ReactQueryDevtools />
          </SearchProvider>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
};

export default Providers;
