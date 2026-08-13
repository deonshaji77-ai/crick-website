"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./firebase";

type AuthContextType = {
  currentUser: User | null;
  isAdmin: boolean;
  markAdminVerified: () => void;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fast-path for existing admin sessions
    const isAlreadyVerified = sessionStorage.getItem("admin_verified") === "true";
    if (isAlreadyVerified) {
      setIsAdmin(true);
      setLoading(false);
    }

    // Safety timeout in case Firebase hangs locally
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(fallbackTimer);
      setCurrentUser(user);
      const isVerified = sessionStorage.getItem("admin_verified") === "true";
      if ((user && user.email === "admin@cricstore.com") || isVerified) {
        setIsAdmin(isVerified);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(fallbackTimer);
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      sessionStorage.removeItem("admin_verified");
      setIsAdmin(false);
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const markAdminVerified = () => {
    sessionStorage.setItem("admin_verified", "true");
    setIsAdmin(true);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, markAdminVerified, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
