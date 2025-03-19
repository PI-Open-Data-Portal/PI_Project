import { AppBar, Toolbar, Button } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login'; // Ícone de login

const Header = () => {
  return (
    <AppBar position="absolute" sx={{ background: "transparent", boxShadow: "none", p: 2 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          sx={{
            fontWeight: 'bold',            // Deixa o texto em negrito
            color: 'white',                // Cor do texto para branco
            border: '2px solid #457884',   // Define a cor do outline para #457884
            borderRadius: '20px',          // Cantos arredondados
            padding: '8px 16px',           // Ajusta o tamanho do botão
            backgroundColor: '#457884',    // Cor de fundo sólida (menos transparente)
            display: 'flex',               // Alinha o ícone e o texto
            alignItems: 'center',          // Alinha o ícone e o texto no centro verticalmente
            '&:hover': {
              borderColor: '#457884',     // Borda com a mesma cor ao passar o mouse
              backgroundColor: '#375f58', // Cor de fundo ao passar o mouse (tom mais escuro)
            }
          }}
        >
          <LoginIcon sx={{ marginRight: 1 }} /> {/* Ícone à esquerda do texto */}
          Sign in
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
