// src/context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom"; // if using react-router
import { auth } from "../firebase/firebase";
import { Spin } from "antd";
import routerUrls from "../common/routers";

// Define the shape of the AuthContext
interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Custom hook to access AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the user is authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("unsubscribe ~ user:", user)
      setCurrentUser(user);
      setLoading(false);
      


      // Redirect to login page if not authenticated
      if (!user) {
        navigate(routerUrls.login); 
      }
      // Redirect to homepage if user is authenticated 
      // and is in the login page now
      else if (location.pathname === routerUrls.login) {
        navigate(routerUrls.chatRoom); 
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [navigate, location]);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {loading ? <Spin /> : children} {/* Only render children if not loading */}
    </AuthContext.Provider>
  );
};
