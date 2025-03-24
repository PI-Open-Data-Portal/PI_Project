import { CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Importando Routes e Route
import Home from "./pages/Home";
import Database from "./pages/Database";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Página inicial */}
        <Route path="/database" element={<Database />} /> {/* Página de banco de dados */}
        <Route path="/admin" element={<Admin />} /> {/* Página de administração */}
        <Route path="/login" element={<Login />} /> {/* Página de login */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
