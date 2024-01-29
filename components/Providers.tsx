"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { ReactNode, useEffect, useState } from "react";
import { AuthProvider } from "@context/AuthContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import { SearchProvider } from "@context/SearchContext";

interface IProps {
  children: ReactNode;
}

const Providers = ({ children }: IProps) => {
  const [mounted, setMounted] = useState(false);
  const queryClient = new QueryClient();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <SearchProvider>
              {children}
              <Analytics />
            </SearchProvider>
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
            <Analytics />
          </SearchProvider>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
};

export default Providers;
