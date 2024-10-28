import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verifySession } from "../helpers/sessions"; // Update the path as needed

export const AuthProtected = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      const result = await verifySession();

      if (result.isAuth) {
        setUser(result.userId); // Assuming you get userId or user object
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [verifySession]);

  if (isLoading) {
    // Show a loading spinner or some placeholder
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  // Assuming you have a way to check for temporary passwords
  // This part needs to be integrated based on your actual logic
  // For now, we're assuming that `user` object might have a `tempPassword` property
  if (user && user.tempPassword) {
    return <Navigate to="/reset-password" />;
  }

  return <React.Fragment>{props.children}</React.Fragment>;
};
