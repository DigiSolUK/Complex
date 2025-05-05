import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  tenantId: number | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  enterDemoMode: () => Promise<void>;
  exitDemoMode: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isDemoMode: false,
  isSuperAdmin: false,
  isAdmin: false,
  tenantId: null,
  login: async () => {},
  logout: async () => {},
  enterDemoMode: async () => {},
  exitDemoMode: () => {},
  isLoading: true,
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        // Use API request to get current user - with explicit logging
        console.log("Auth check - sending request to /api/auth/me");
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          }
        });
        console.log("Auth check response status:", res.status);

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          console.log("User authenticated:", userData);
        } else {
          console.log("Not authenticated, status:", res.status);
          setUser(null);
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Unlike before, we will always check authentication first,
    // and only enable demo mode if explicitly requested via enterDemoMode()
    checkAuth();
    
    // Clear any existing demo mode from localStorage to prevent auto-login
    if (localStorage.getItem("demoMode") === "true") {
      localStorage.removeItem("demoMode");
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Login - attempting to authenticate with", { username });
      
      // Use fetch directly with more control instead of apiRequest
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });
      
      console.log("Login response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Login failed:", errorText);
        throw new Error(errorText || "Login failed");
      }
      
      const userData = await res.json();
      console.log("Login successful, user data received", userData);
      setUser(userData);
      
      // Clear demo mode if it was active
      if (isDemoMode) {
        setIsDemoMode(false);
        localStorage.removeItem("demoMode");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials and try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const enterDemoMode = async () => {
    setIsLoading(true);
    try {
      setIsDemoMode(true);
      localStorage.setItem("demoMode", "true");
      setUser(null);
    } catch (err) {
      console.error("Entering demo mode failed:", err);
      setIsDemoMode(false);
      localStorage.removeItem("demoMode");
    } finally {
      setIsLoading(false);
    }
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    localStorage.removeItem("demoMode");
  };

  // Check if user is superadmin or admin
  const isSuperAdmin = !!user && user.role === "superadmin";
  const isAdmin = !!user && (user.role === "admin" || user.role === "superadmin");
  
  // Extract tenantId from user
  const tenantId = user?.tenantId || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isDemoMode,
        isSuperAdmin,
        isAdmin,
        tenantId,
        login,
        logout,
        enterDemoMode,
        exitDemoMode,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
