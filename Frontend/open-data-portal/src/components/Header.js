import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Button } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check if user is logged in by looking for JWT token in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      
      // Fetch user data to display the name
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('/apiV1/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const users = await response.json();
        
        // If we have users data, we can try to identify the current user
        // For now, just set a generic username
        setUsername("User");
        
        // You could expand this later to identify the specific user if needed
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Update state
    setIsLoggedIn(false);
    setUsername("");
    // Navigate to home page
    navigate("/");
  };

  return (
    <AppBar position="absolute" sx={{ background: "transparent", boxShadow: "none", p: 2 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
        {!isLoggedIn ? (
          <Button
            onClick={() => navigate("/login")}
            sx={{
              fontWeight: 'bold',
              color: 'white',
              border: '2px solid #457884',
              borderRadius: '20px',
              padding: '8px 16px',
              backgroundColor: '#457884',
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                borderColor: '#457884',
                backgroundColor: '#375f58',
              }
            }}
          >
            <LoginIcon sx={{ marginRight: 1 }} />
            Sign in
          </Button>
        ) : (
          <Button
            onClick={handleLogout}
            sx={{
              fontWeight: 'bold',
              color: 'white',
              border: '2px solid #457884',
              borderRadius: '20px',
              padding: '8px 16px',
              backgroundColor: '#457884',
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                borderColor: '#457884',
                backgroundColor: '#375f58',
              }
            }}
          >
            <LogoutIcon sx={{ marginRight: 1 }} />
            Log out
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;