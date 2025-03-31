import React, { useState } from 'react';
import { Box, Button, AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import MainTable1 from '../components/MainTable1';
import MainTable2 from '../components/MainTable2';
import MainTable3 from '../components/MainTable3';
import MainTable4 from '../components/MainTable4';
import MainTable5 from '../components/MainTable5';

import logo from '../assets/logopng.png';

const Database = () => {
  const [selectedTable, setSelectedTable] = useState('table1');

  const renderTableComponent = () => {
    switch (selectedTable) {
      case 'table1':
        return <MainTable1 />;
      case 'table2':
        return <MainTable2 />;
      case 'table3':
        return <MainTable3 />;
      case 'table4':
        return <MainTable4 />;
      case 'table5':
        return <MainTable5 />;
      default:
        return <MainTable1 />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar>
          <Link to="/">
            <img src={logo} alt="Logo" width={100} height={100} />
          </Link>
          <Typography variant="h4" sx={{ marginLeft: 1, fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
            Porto de Aveiro
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
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
            minWidth: '200px',
          }}
        >
          <Button
            variant="contained"
            onClick={() => setSelectedTable('table1')}
            sx={{
              width: '100%',
              marginBottom: 1,
              borderRadius: 2,
              backgroundColor: selectedTable === 'table1' ? '#3a6d6d' : '#457884',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: '#3a6d6d',
                boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            Ship Details
          </Button>
          
          <Button
            variant="contained"
            onClick={() => setSelectedTable('table2')}
            sx={{
              width: '100%',
              marginBottom: 1,
              borderRadius: 2,
              backgroundColor: selectedTable === 'table2' ? '#3a6d6d' : '#457884',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: '#3a6d6d',
                boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            container Details
          </Button>
          
          <Button
            variant="contained"
            onClick={() => setSelectedTable('table3')}
            sx={{
              width: '100%',
              marginBottom: 1,
              borderRadius: 2,
              backgroundColor: selectedTable === 'table3' ? '#3a6d6d' : '#457884',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: '#3a6d6d',
                boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            Provenance Statistics
          </Button>

          <Button
            variant="contained"
            onClick={() => setSelectedTable('table4')}
            sx={{
              width: '100%',
              marginBottom: 1,
              borderRadius: 2,
              backgroundColor: selectedTable === 'table4' ? '#3a6d6d' : '#457884',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: '#3a6d6d',
                boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            Embarcation Ports
          </Button>

          <Button
            variant="contained"
            onClick={() => setSelectedTable('table5')}
            sx={{
              width: '100%',
              marginBottom: 1,
              borderRadius: 2,
              backgroundColor: selectedTable === 'table5' ? '#3a6d6d' : '#457884',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: '#3a6d6d',
                boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            Product Categories
          </Button>

        </Box>

        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: '#f4f4f4',
            overflowY: 'auto',
            padding: 3,
          }}
        >
          {renderTableComponent()}
        </Box>
      </Box>
    </Box>
  );
};

export default Database;