import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Network } from 'vis-network/standalone';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, AppBar, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Substituindo useHistory por useNavigate
import { Link } from 'react-router-dom';
import logo from '../assets/logopng.png'; // Importando o logo

import 'vis-network/styles/vis-network.css';

const GrafoViewer = () => {
  const [data, setData] = useState(null); // Estado para armazenar o JSON retornado
  const [loading, setLoading] = useState(true); // Estado para mostrar carregando
  const [error, setError] = useState(null); // Estado para erros
  const [modalData, setModalData] = useState(null); // Estado para dados do modal
  const [searchQuery, setSearchQuery] = useState(''); // Estado para busca na tabela

  const containerRef = useRef(null); // Referência para o container do grafo

  // Pega o parâmetro 'prov' da URL
  const urlParams = new URLSearchParams(window.location.search); 
  const prov = urlParams.get('prov'); 

  const navigate = useNavigate(); // Hook para navegação (substituindo useHistory)

  useEffect(() => {
    if (prov) {
      const fetchData = async () => {
        try {
          setLoading(true);
          // Ajustando o endpoint para a porta 8000
          const response = await axios.get('http://localhost:8000/api/grafo', { params: { prov } });
          setData(response.data); // Armazenando a resposta no estado
        } catch (err) {
          setError('Erro ao buscar dados');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [prov]);

  // Lógica para renderizar o grafo quando os dados estiverem prontos
  useEffect(() => {
    if (data) {
      const network = new Network(containerRef.current, {
        nodes: data.nodes,
        edges: data.edges,
      }, {
        layout: { hierarchical: false },
        physics: { stabilization: true },
        interaction: { hover: true },
      });

      network.on("click", (params) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const info = data.modal_info[nodeId];
          if (info) setModalData(info);
        }
      });
    }
  }, [data]);

  const handleCloseModal = () => {
    setModalData(null);
    setSearchQuery('');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleGoBack = () => {
    navigate('/database'); // Navega para /database usando o hook navigate
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}><CircularProgress /></div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ position: 'relative' }}>
      {/* Botão de Voltar para /database */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoBack}
        style={{
          position: 'absolute',
          top: 30,
          right: 10,
          zIndex: 1000,  // Garantindo que o botão fique acima de outros elementos
        }}
      >
        Return to Database
      </Button>

      <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar>
          <Link to="/">
            <img src={logo} alt="Logo" width={100} height={100} />
          </Link>
          <Typography variant="h4" sx={{ marginLeft: 1, fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
            Provenance Graph
          </Typography>
        </Toolbar>
      </AppBar>
      <div ref={containerRef} style={{ height: "600px", width: "100%" }} />

      {modalData && (
        <Dialog open={true} onClose={handleCloseModal} maxWidth="lg" fullWidth>
          <DialogTitle>Informação da Tabela {modalData.table}</DialogTitle>
          <DialogContent dividers>
            <TextField
              label="Procurar atributo..."
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              margin="normal"
            />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Atributo</strong></TableCell>
                    <TableCell><strong>Valor</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(modalData.dados)
                    .filter(([key]) => key.toLowerCase().includes(searchQuery))
                    .map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell>{key}</TableCell>
                        <TableCell>{String(value)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default GrafoViewer;
