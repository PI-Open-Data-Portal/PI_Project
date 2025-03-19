import { Box, Button, Typography } from "@mui/material";
import background from "../assets/a.jpg";
import logo from "../assets/logopng.png";
import StorageIcon from '@mui/icons-material/Storage';

const Hero = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",          // Faz o fundo cobrir toda a área
        backgroundPosition: "center",     // Centraliza a imagem no fundo
        backgroundRepeat: "no-repeat",    // Impede a repetição da imagem
        textAlign: "center",
        color: "black",
        pt: 2,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: -15 }}>
        <img src={logo} alt="Logo" width={400} />
        <Typography
          variant="h2"
          sx={{ fontWeight: "", mt: -6.5, fontFamily: "'Kdam Thmor Pro', sans-serif" }}
        >
          Open Data Portal
        </Typography>
      </Box>
      <Button
        variant="contained"
        sx={{
          mt: 4,
          px: 4,
          py: 2,
          fontSize: "1.2rem",
          background: "#457884",
          borderRadius: "50px",
          fontFamily: "'Kdam Thmor Pro', sans-serif",
          display: "flex",
          alignItems: "center",
        }}
      >
        <StorageIcon sx={{ mr: 1 }} />
        Visit our database
      </Button>
    </Box>
  );
};

export default Hero;
