import { Box, Button, Typography } from "@mui/material";
import background from "../assets/a.jpg";
import logo from "../assets/logopng.png";
import StorageIcon from '@mui/icons-material/Storage';
import { Link } from "react-router-dom"; // Importando Link do React Router

const Hero = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        textAlign: "center",
        color: "black",
        pt: 2,
        margin: 0,
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
      
      {/* Usando o Link para navegação */}
      <Link to="/database" style={{ textDecoration: "none" }}>
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
      </Link>
    </Box>
  );
};

export default Hero;
