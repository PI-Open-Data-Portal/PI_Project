import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Network } from 'vis-network/standalone';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, AppBar, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '../assets/logopng.png';

import 'vis-network/styles/vis-network.css';

const GrafoViewer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false); // Loading state for modal data
  const [searchQuery, setSearchQuery] = useState('');

  const containerRef = useRef(null);

  // Pega o parâmetro 'prov' da URL
  const urlParams = new URLSearchParams(window.location.search); 
  const prov = urlParams.get('prov'); 

  const navigate = useNavigate();

  useEffect(() => {
    if (prov) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get('http://localhost:8000/api/grafo', { params: { prov } });
          setData(response.data);
        } catch (err) {
          setError('Erro ao buscar dados');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [prov]);

  // Função para extrair tabela do título do nó
  const extractTableFromNode = (nodeId) => {
    const node = data.nodes.find(n => n.id === nodeId);
    if (node && node.title && node.title.includes('Tabela: ')) {
      return node.title.replace('Tabela: ', '');
    }
    return null;
  };

  // Função para buscar dados do nó clicado
  const fetchNodeData = async (nodeId) => {
    const table = extractTableFromNode(nodeId);
    
    if (!table) {
      // Se não for um nó da tabela, mostrar informações básicas
      const node = data.nodes.find(n => n.id === nodeId);
      return {
        table: 'Informações do Nó',
        dados: {
          'ID': nodeId,
          'Label': node?.label || 'N/A',
          'Tipo': node?.shape === 'ellipse' ? 'Subexpressão' : 'Tabela',
          'Título': node?.title || 'N/A'
        }
      };
    }

    try {
      setModalLoading(true);
      const response = await axios.get('http://localhost:8000/api/dados', {
        params: { table, prov: nodeId }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados do nó:', error);
      return {
        table: table,
        dados: { 'Erro': 'Não foi possível carregar os dados desta tabela' }
      };
    } finally {
      setModalLoading(false);
    }
  };

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

      network.on("click", async (params) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          
          try {
            const nodeData = await fetchNodeData(nodeId);
            setModalData(nodeData);
          } catch (error) {
            console.error('Erro ao processar clique no nó:', error);
            setModalData({
              table: 'Erro',
              dados: { 'Erro': 'Não foi possível carregar os dados' }
            });
          }
        }
      });

      // Cleanup function para remover event listeners
      return () => {
        network.destroy();
      };
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
    navigate('/database');
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
          zIndex: 1000,
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
          <DialogTitle>
            Informação da Tabela {modalData.table}
            {modalLoading && <CircularProgress size={20} style={{ marginLeft: 10 }} />}
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              label="Procurar atributo..."
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              margin="normal"
            />
            {modalLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <CircularProgress />
              </div>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Atributo</strong></TableCell>
                      <TableCell><strong>Valor</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {modalData.dados && Object.entries(modalData.dados)
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
            )}
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