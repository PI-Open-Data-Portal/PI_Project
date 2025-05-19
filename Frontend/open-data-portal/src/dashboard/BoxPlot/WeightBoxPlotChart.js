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
  const [selectedOutlier, setSelectedOutlier] = useState(null);

  // Define a color palette to use for different provenances
  const colorPalette = [
    { box: 'rgba(93, 164, 214, 0.5)', line: 'rgba(93, 164, 214, 1)', points: 'rgba(255, 65, 54, 0.7)' },
    { box: 'rgba(44, 160, 101, 0.5)', line: 'rgba(44, 160, 101, 1)', points: 'rgba(255, 144, 14, 0.7)' },
    { box: 'rgba(255, 65, 54, 0.5)', line: 'rgba(255, 65, 54, 1)', points: 'rgba(93, 164, 214, 0.7)' },
    { box: 'rgba(207, 114, 255, 0.5)', line: 'rgba(207, 114, 255, 1)', points: 'rgba(44, 160, 44, 0.7)' },
    { box: 'rgba(127, 96, 0, 0.5)', line: 'rgba(127, 96, 0, 1)', points: 'rgba(214, 39, 40, 0.7)' },
    { box: 'rgba(255, 140, 184, 0.5)', line: 'rgba(255, 140, 184, 1)', points: 'rgba(148, 103, 189, 0.7)' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch outliers from your backend endpoint
        const outliersResponse = await axios.get('http://localhost:8080/apiV1/casestudy/outliers');
        const outliersData = outliersResponse.data;
        
        // Group outliers by provenance for the box plot
        const { grouped: groupedOutliers, outlierDetails } = groupOutliersByProv(outliersData);
        
        // Prepare plot data showing just the outliers per provenance
        const plotlyData = preparePlotData(groupedOutliers, outlierDetails);
        
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
    const outlierDetails = {}; // Store full details for each point
    
    outliers.forEach(outlier => {
      const provKey = outlier.prov2?.match(/[A-Za-z]/g)?.join('') || 'Unknown';
      
      if (!grouped[provKey]) {
        grouped[provKey] = [];
        outlierDetails[provKey] = {};
      }
      
      grouped[provKey].push(outlier.weight);
      // Store the outlier's full details using weight as key (for later retrieval)
      outlierDetails[provKey][outlier.weight] = outlier;
    });
    
    return { grouped, outlierDetails };
  };

  // Prepare plot data showing outliers per provenance with different colors
  const preparePlotData = (groupedOutliers) => {
    return Object.entries(groupedOutliers).map(([provKey, weights], index) => {
      // Use modulo to cycle through the color palette
      const colorIndex = index % colorPalette.length;
      const colors = colorPalette[colorIndex];
      
      return {
        type: 'box',
        y: weights,
        name: provKey,
        boxpoints: 'outliers', // Only show outlier points (outside of whiskers)
        jitter: 0.3,
        pointpos: 0,
        marker: {
          color: colors.points,
          size: 6,
          line: {
            width: 1,
            color: 'rgba(0,0,0,0.5)'
          }
        },
        fillcolor: colors.box,
        line: {
          color: colors.line,
          width: 2
        },
        boxmean: true,
        hoverinfo: 'y+name',
        orientation: 'v',
        hoverlabel: {
          bgcolor: 'white',
          bordercolor: 'black',
          font: { family: "'Kdam Thmor Pro', sans-serif" }
        }
      };
    });
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
                showlegend: false,
                plot_bgcolor: 'rgba(240,240,240,0.7)',
                paper_bgcolor: 'rgba(255,255,255,1)'
              }}
              config={{
                responsive: true,
                displayModeBar: true,
                modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                displaylogo: false
              }}
              style={{ width: '100%', height: '100%' }}
              onClick={(data) => {
                // Handle point clicks
                if (data.points && data.points.length > 0) {
                  const point = data.points[0];
                  // Find the outlier in our original data
                  const clickedOutlier = outliers.find(o => 
                    o.weight === point.y && 
                    o.prov2?.match(/[A-Za-z]/g)?.join('') === point.data.name
                  );
                  
                  if (clickedOutlier) {
                    setSelectedOutlier(clickedOutlier);
                  }
                }
              }}
            />
          </Box>
        )}
        
        {/* Selected Outlier Details */}
        {selectedOutlier && (
          <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#f9f9f9' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50', fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
              Selected Outlier Details
              <Typography 
                component="span" 
                sx={{ 
                  ml: 2, 
                  cursor: 'pointer', 
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' } 
                }}
                onClick={() => setSelectedOutlier(null)}
              >
                (Close)
              </Typography>
            </Typography>
            
            <TableContainer component={Paper} sx={{ mt: 1 }}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>ID</TableCell>
                    <TableCell>{selectedOutlier.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Weight</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'error.main' }}>{selectedOutlier.weight}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Provenance</TableCell>
                    <TableCell>{selectedOutlier.prov2}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Movement Date</TableCell>
                    <TableCell>{selectedOutlier.movement_Date}</TableCell>
                  </TableRow>
                  {/* Add any additional fields that might be relevant */}
                  {Object.entries(selectedOutlier).filter(([key]) => 
                    !['id', 'weight', 'prov2', 'movement_Date'].includes(key)
                  ).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell sx={{ fontWeight: 'bold' }}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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