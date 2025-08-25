"use client";

import { useAuthStore } from "@/lib/authStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect if not authenticated or not verified
  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || !user?.isVerified)) {
      router.push("/signup");
    }
  }, [isCheckingAuth, isAuthenticated, user, router]);

  if (isCheckingAuth) {
    return <div>Checking authentication...</div>; // Optional loader
  }

  if (isAuthenticated && user?.isVerified) {
    return <div>Omsims {user.name}</div>;
  }

  return null;
}
