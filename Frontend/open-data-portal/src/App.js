import { CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Importando Routes e Route
import Home from "./pages/Home"; // Página inicial
import Database from "./pages/Database"; // Sua página de banco de dados (crie-a se não existir)

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Página inicial */}
        <Route path="/database" element={<Database />} /> {/* Página de banco de dados */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
