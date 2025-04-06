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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const MAX_PAGES_TO_FETCH = 10; // Limiting initial pages for testing

  useEffect(() => {
    const pageSize = 50;
    let allData = [];

    const initFetch = async () => {
      try {
        setIsLoading(true);
        setLoadingProgress(0);

        const firstPageResponse = await axios.get('http://localhost:8080/apiV1/casestudy', {
          params: {
            page: 0,
            size: pageSize,
            sort: 'movementDate,asc'
          }
        });

        if (firstPageResponse.data && firstPageResponse.data.page) {
          const { totalPages: pages } = firstPageResponse.data.page;
          const pagesToFetch = Math.min(pages, MAX_PAGES_TO_FETCH);
          setTotalPages(pagesToFetch);

          if (firstPageResponse.data._embedded && firstPageResponse.data._embedded.caseStudyList) {
            allData = [...allData, ...firstPageResponse.data._embedded.caseStudyList];
            setLoadingProgress(1 / pagesToFetch * 100);
          }

          await fetchRemainingPages(pagesToFetch, pageSize, allData);
        } else {
          throw new Error('Invalid response format: pagination info missing');
        }
      } catch (err) {
        console.error('Error during initial data fetch:', err);
        setError(`Failed to load data: ${err.message}`);
        setIsLoading(false);
      }
    };

    const fetchRemainingPages = async (totalPages, pageSize, currentData) => {
      try {
        for (let page = 1; page < totalPages; page++) {
          const response = await axios.get('http://localhost:8080/apiV1/casestudy', {
            params: {
              page: page,
              size: pageSize,
              sort: 'movementDate,asc'
            }
          });

          if (response.data._embedded && response.data._embedded.caseStudyList) {
            currentData = [...currentData, ...response.data._embedded.caseStudyList];
            setLoadingProgress(((page + 1) / totalPages) * 100);
          }
        }

        processData(currentData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching additional pages:', err);
        setError(`Failed to load full data: ${err.message}`);

        if (currentData.length > 0) {
          processData(currentData);
        } else {
          setIsLoading(false);
        }
      }
    };

    initFetch();
  }, []);

  const processData = (rawData) => {
    // Group data by prov2 category
    const groupedByProv = {};
    const allItems = [];

    rawData.forEach(item => {
      if (!item.weight || !item.prov2) return;
      
      const provKey = item.prov2.match(/[A-Za-z]/g)?.join('') || 'Unknown';
      
      if (!groupedByProv[provKey]) {
        groupedByProv[provKey] = [];
      }
      
      // Only include valid numeric weights
      const weight = parseFloat(item.weight);
      if (!isNaN(weight) && weight > 0) {
        groupedByProv[provKey].push(weight);
        
        // Save item with its processed provKey for later use
        allItems.push({
          id: item.id || 'N/A',
          weight: weight,
          prov2: item.prov2,
          provKey: provKey,
          movementDate: item.movementDate || 'N/A',
          // Add other fields as needed
        });
      }
    });

    // Filter groups with too few data points
    const filteredGroups = Object.fromEntries(
      Object.entries(groupedByProv).filter(([_, values]) => values.length >= 5)
    );
    
    // Calculate statistics for each group to identify outliers
    const outlierItems = [];
    Object.entries(filteredGroups).forEach(([provKey, weights]) => {
      if (weights.length < 5) return;
      
      // Calculate quartiles and IQR
      weights.sort((a, b) => a - b);
      const q1 = weights[Math.floor(weights.length * 0.25)];
      const q3 = weights[Math.floor(weights.length * 0.75)];
      const iqr = q3 - q1;
      
      // Define outlier thresholds (1.5 * IQR beyond Q1 and Q3)
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;
      
      // Find items that are outliers
      const groupOutliers = allItems.filter(item => 
        item.provKey === provKey && 
        (item.weight < lowerBound || item.weight > upperBound)
      );
      
      outlierItems.push(...groupOutliers);
    });
    
    // Sort outliers by provenance then by weight (descending) to highlight extreme values
    outlierItems.sort((a, b) => {
      // First sort by provenance
      if (a.provKey < b.provKey) return -1;
      if (a.provKey > b.provKey) return 1;
      // Then by weight (descending)
      return b.weight - a.weight;
    });
    
    setOutliers(outlierItems);
    
    // Transform into Plotly format for box plots
    const plotlyData = Object.entries(filteredGroups).map(([provKey, weights]) => ({
      type: 'box',
      y: weights,
      name: provKey,
      boxpoints: 'outliers',
      jitter: 0.3,
      pointpos: 0,
      marker: {
        color: 'rgba(255, 0, 0, 0.6)',
        size: 4
      },
      boxmean: true,
      orientation: 'v',
      hoverinfo: 'y+name',
      hoverlabel: {
        bgcolor: 'white',
        bordercolor: 'black',
        font: { family: "'Kdam Thmor Pro', sans-serif" }
      }
    }));
    
    setData(plotlyData);
  };

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>
          Loading data ({Math.round(loadingProgress)}%)
        </Typography>
        <Typography variant="caption" sx={{ mt: 1 }}>
          Loading page {Math.ceil(loadingProgress / 100 * totalPages)} of {totalPages} (Limited to {MAX_PAGES_TO_FETCH} pages for testing)
        </Typography>
      </Box>
    );
  }

  if (error && data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Get total sample count
  let totalSamples = 0;
  data.forEach(box => {
    totalSamples += box.y.length;
  });

  return (
    <Card elevation={3} sx={{ marginBottom: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50', fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
          Weight Distribution by Provenance
        </Typography>

        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error} (Showing partial data)
          </Alert>
        )}

        {data.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            <Typography>No valid weight data available</Typography>
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
        
        <Typography variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
          Sample size: {totalSamples} records from {data.length} provenance categories 
          (categories with fewer than 5 records were excluded)
        </Typography>
        
        {/* Outliers Table */}
        {outliers.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50', fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
              Outlier Records
            </Typography>
            
            <Typography variant="body2" gutterBottom>
              Below are records with weights that fall outside the typical range for their provenance category 
              (defined as values beyond 1.5 × IQR from the first and third quartiles).
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
                      <TableCell>{item.movementDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'right' }}>
              {outliers.length} outlier record{outliers.length !== 1 ? 's' : ''} displayed
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WeightBoxPlotChart;