import React from 'react';
import { Box, Button, AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import StickyHeadTable from '../components/StickyHeadTable';

import logo from '../assets/logopng.png';

const Database = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      <Box
        sx={{
          width: '200px',
          backgroundColor: '#457884',
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          fontFamily: "'Kdam Thmor Pro', sans-serif",
          position: 'absolute',
          top: '100px',
          bottom: 0,
          zIndex: 1,
          paddingTop: '30px',
        }}
      >
        
        <Link to="/database" style={{ textDecoration: 'none', marginBottom: '10px' }}>
          <Button
            variant="contained"
            sx={{
              width: '100%',
              marginBottom: 1,
              borderRadius: 2,
              backgroundColor: '#457884',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: '#3a6d6d',
                boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            Tabela 1
          </Button>
        </Link>
        <Link to="/database" style={{ textDecoration: 'none', marginBottom: '10px' }}>
          <Button
            variant="contained"
            sx={{
              width: '100%',
              marginBottom: 1,
              borderRadius: 2,
              backgroundColor: '#457884',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: '#3a6d6d',
                boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            Tabela 2
          </Button>
        </Link>
        <Link to="/database" style={{ textDecoration: 'none', marginBottom: '10px' }}>
          <Button
            variant="contained"
            sx={{
              width: '100%',
              marginBottom: 1,
              borderRadius: 2,
              backgroundColor: '#457884',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: '#3a6d6d',
                boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            Tabela 3
          </Button>
        </Link>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          marginLeft: '200px',
          backgroundColor: '#f4f4f4',
        }}
      >
        <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'black', width: '100%' }}>
          <Toolbar>
            <Link to="/">
              <img src={logo} alt="Logo" width={100} height={100} />
            </Link>
            <Typography variant="h4" sx={{ marginLeft: 1, fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
              Porto de Aveiro
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ marginTop: '100px', padding: 3 }}>
          <StickyHeadTable />
        </Box>
      </Box>
    </Box>
  );
};

export default Database;