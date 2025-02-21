"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { selectIsAuthenticated } from "@/redux/features/auth-slice";
import { useAppSelector } from "@/redux/store";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure the component is mounted before checking auth status
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push("/"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, router, isMounted]);

  if (!isMounted) return null; // Prevent hydration issues

  return <div>{isAuthenticated ? children : null}</div>;
}
