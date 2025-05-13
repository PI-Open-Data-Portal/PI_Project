import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import {
  Card, CardContent, Typography, Box, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

const WeightBoxPlotChart = () => {
  const [data, setData] = useState([]);
  const [outliers, setOutliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch outliers from your backend endpoint
        const outliersResponse = await axios.get('http://localhost:8080/apiV1/casestudy/outliers');
        const outliersData = outliersResponse.data;
        
        // Group outliers by provenance for the box plot
        const groupedOutliers = groupOutliersByProv(outliersData);
        
        // Prepare plot data showing just the outliers per provenance
        const plotlyData = preparePlotData(groupedOutliers);
        
        setData(plotlyData);
        setOutliers(outliersData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Failed to load data: ${err.message}`);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group outliers by provenance
  const groupOutliersByProv = (outliers) => {
    const grouped = {};
    
    outliers.forEach(outlier => {
      const provKey = outlier.prov2?.match(/[A-Za-z]/g)?.join('') || 'Unknown';
      
      if (!grouped[provKey]) {
        grouped[provKey] = [];
      }
      
      grouped[provKey].push(outlier.weight);
    });
    
    return grouped;
  };

  // Prepare plot data showing outliers per provenance
  const preparePlotData = (groupedOutliers) => {
    return Object.entries(groupedOutliers).map(([provKey, weights]) => ({
      type: 'box',
      y: weights,
      name: provKey,
      boxpoints: 'all', // Show all points since we're only displaying outliers
      jitter: 0.3,
      pointpos: 0,
      marker: {
        color: 'rgba(255, 0, 0, 0.8)',
        size: 4,
        
      },
      boxmean: true,
      hoverinfo: 'y+name',
      orientation: 'v',
      hoverlabel: {
        bgcolor: 'white',
        bordercolor: 'black',
        font: { family: "'Kdam Thmor Pro', sans-serif" }
      }
    }));
  };

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading outlier data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Card elevation={3} sx={{ marginBottom: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50', fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
          Outlier Records by Provenance
        </Typography>

        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {data.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            <Typography>No outlier data available</Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: 500 }}>
            <Plot
              data={data}
              layout={{
                title: false,
                height: 500,
                margin: { l: 50, r: 20, t: 30, b: 80 },
                yaxis: {
                  title: 'Weight',
                  zeroline: false,
                  gridcolor: 'rgba(0,0,0,0.1)'
                },
                xaxis: {
                  title: 'Provenance',
                  zeroline: false,
                  tickangle: 45
                },
                boxmode: 'group',
                font: {
                  family: "'Kdam Thmor Pro', sans-serif"
                },
                hovermode: 'closest',
                showlegend: false
              }}
              config={{
                responsive: true,
                displayModeBar: true,
                modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                displaylogo: false
              }}
              style={{ width: '100%', height: '100%' }}
            />
          </Box>
        )}
        
        {/* Outliers Table */}
        {outliers.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50', fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
              Outlier Records ({outliers.length} total)
            </Typography>
            
            <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Weight</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Provenance</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Movement Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {outliers.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.weight}</TableCell>
                      <TableCell>{item.prov2}</TableCell>
                      <TableCell>{item.movement_Date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WeightBoxPlotChart;