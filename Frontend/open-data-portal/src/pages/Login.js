import React from "react";
import { TextField, Button, Box, Typography, InputAdornment } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import loginImage from "../assets/login.png";
import logoImage from "../assets/logopng.png";

const Login = () => {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          position: "relative",
        }}
      >
        {/* Botão para a Main Page no canto superior direito */}
        <Button
          variant="text"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            fontFamily: "'Kdam Thmor Pro', sans-serif",
            color: "#457884",
            textTransform: "none",
          }}
          href="/"
        >
          Go to Main Page
        </Button>

        {/* Imagem do lado esquerdo */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${loginImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
  
        {/* Área de Login */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "#fff",
            padding: 4,
            mt: 8,
          }}
        >
          {/* Logo */}
          <Box component="img" src={logoImage} alt="Logo" sx={{ width: 275, mb: 2 }} />
  
          {/* Título */}
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
            Sign in
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
            Welcome back to the Open Data Portal
          </Typography>
  
          {/* Campos de Login */}
          <TextField
            variant="outlined"
            label="Email Address"
            type="email"
            sx={{ mt: 2, width: "60%" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            label="Password"
            type="password"
            sx={{ mt: 2, width: "60%" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
  
          {/* Botão de Login */}
          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: "#457884", color: "white", borderRadius: "30px", width: "30%", height: "50px", fontFamily: "'Kdam Thmor Pro', sans-serif" }}
          >
            Login
          </Button>
  
          {/* Link de recuperação de senha */}
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mt: 1, cursor: "pointer", textDecoration: "underline", fontFamily: "'Kdam Thmor Pro', sans-serif" }}
          >
            Forgot Password
          </Typography>
        </Box>
      </Box>
    );
  };

export default Login;