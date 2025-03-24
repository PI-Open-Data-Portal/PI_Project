import React from "react";
import { AppBar, Toolbar, Button } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="absolute" sx={{ background: "transparent", boxShadow: "none", p: 2 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
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
      </Toolbar>
    </AppBar>
  );
};

export default Header;