import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import {
  Card, CardContent, Typography, Box, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Button, Grid, Slider, FormControl, InputLabel, MenuItem, Select,
  Divider, IconButton, Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DownloadIcon from '@mui/icons-material/Download';

const WeightBoxPlotChart = () => {
  // State for data
  const [data, setData] = useState([]);
  const [outliers, setOutliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOutlier, setSelectedOutlier] = useState(null);
  const [provOptions, setProvOptions] = useState([]);
  
  // State for filters
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    searchId: '',
    selectedProvenance: ''
  });

  // Track if filters have been applied at least once
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Define a color palette to use for different provenances
  const colorPalette = [
    { box: 'rgba(93, 164, 214, 0.5)', line: 'rgba(93, 164, 214, 1)', points: 'rgba(255, 65, 54, 0.7)' },
    { box: 'rgba(44, 160, 101, 0.5)', line: 'rgba(44, 160, 101, 1)', points: 'rgba(255, 144, 14, 0.7)' },
    { box: 'rgba(255, 65, 54, 0.5)', line: 'rgba(255, 65, 54, 1)', points: 'rgba(93, 164, 214, 0.7)' },
    { box: 'rgba(207, 114, 255, 0.5)', line: 'rgba(207, 114, 255, 1)', points: 'rgba(44, 160, 44, 0.7)' },
    { box: 'rgba(127, 96, 0, 0.5)', line: 'rgba(127, 96, 0, 1)', points: 'rgba(214, 39, 40, 0.7)' },
    { box: 'rgba(255, 140, 184, 0.5)', line: 'rgba(255, 140, 184, 1)', points: 'rgba(148, 103, 189, 0.7)' },
  ];

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters and fetch data
  const applyFilters = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setFiltersApplied(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters.startDate) {
        const formattedStartDate = filters.startDate.toISOString().split('T')[0];
        params.append('startDate', formattedStartDate);
      }
      
      if (filters.endDate) {
        const formattedEndDate = filters.endDate.toISOString().split('T')[0];
        params.append('endDate', formattedEndDate);
      }
      
      if (filters.minWeight) {
        params.append('minWeight', filters.minWeight);
      }
      
      if (filters.maxWeight) {
        params.append('maxWeight', filters.maxWeight);
      }
      
      if (filters.searchId) {
        params.append('id', filters.searchId);
      }
      
      if (filters.selectedProvenance) {
        params.append('provType', filters.selectedProvenance);
      }
      
      // Fetch outliers with filters
      const outliersResponse = await axios.get(`http://localhost:8080/apiV1/casestudy/outliers?${params.toString()}`);
      const outliersData = outliersResponse.data;
      
      if (outliersData.length === 0) {
        setError('No records found with the selected filters.');
        setData([]);
        setOutliers([]);
      } else {
        // Group outliers by provenance for the box plot
        const { grouped: groupedOutliers, outlierDetails } = groupOutliersByProv(outliersData);
        
        // Prepare plot data showing just the outliers per provenance
        const plotlyData = preparePlotData(groupedOutliers, outlierDetails);
        
        setData(plotlyData);
        setOutliers(outliersData);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(`Failed to load data: ${err.message}`);
      setIsLoading(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      searchId: '',
      selectedProvenance: ''
    });
    
    if (filtersApplied) {
      applyFilters();
    }
  };

  useEffect(() => {
    // Get list of provenance types
    const fetchProvenanceOptions = async () => {
      try {
        // This would ideally be a separate endpoint to get all unique prov2 values
        // For now, we'll simulate with a direct call to outliers and extract unique values
        const response = await axios.get('http://localhost:8080/apiV1/casestudy/outliers');
        const uniqueProvs = [...new Set(response.data.map(item => 
          item.prov2?.match(/[A-Za-z]/g)?.join('') || 'Unknown'
        ))];
        setProvOptions(uniqueProvs);
      } catch (err) {
        console.error('Error fetching provenance options:', err);
      }
    };

    fetchProvenanceOptions();
  }, []);

  // Display initial message when first loading
  useEffect(() => {
    if (!filtersApplied) {
      setError('Please select filters and click "Apply Filters" to view data.');
    }
  }, [filtersApplied]);

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
    // Handle highlighting specific ID if requested
    const highlightId = filters.searchId ? parseInt(filters.searchId, 10) : null;
    
    return Object.entries(groupedOutliers).map(([provKey, weights], index) => {
      // Use modulo to cycle through the color palette
      const colorIndex = index % colorPalette.length;
      const colors = colorPalette[colorIndex];
      
      // Basic boxplot config
      const plotConfig = {
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
      
      // If we're searching for a specific ID, we'll add custom markers
      if (highlightId) {
        const highlightedOutlier = outliers.find(o => o.id === highlightId && 
                                    o.prov2?.match(/[A-Za-z]/g)?.join('') === provKey);
        
        if (highlightedOutlier) {
          // Add a scatter trace for the highlighted point
          return [
            plotConfig,
            {
              type: 'scatter',
              y: [highlightedOutlier.weight],
              x: [provKey],
              mode: 'markers',
              marker: {
                color: 'red',
                size: 12,
                symbol: 'circle',
                line: {
                  color: 'black',
                  width: 2
                }
              },
              hoverinfo: 'text',
              text: `ID: ${highlightedOutlier.id}<br>Weight: ${highlightedOutlier.weight}`,
              name: `ID: ${highlightedOutlier.id}`
            }
          ];
        }
      }
      
      return plotConfig;
    }).flat(); // Flatten in case we added highlighted points
  };

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading outlier data...</Typography>
      </Box>
    );
  }

  return (
    <Card elevation={3} sx={{ marginBottom: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50', fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
          Outlier Records by Provenance
        </Typography>
        
        {/* Filters Section */}
<Card variant="outlined" sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa' }}>
  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50' }}>
    <FilterAltIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
    Filters
  </Typography>
  
  <Grid container spacing={2}>
    {/* Date Range */}
    <Grid item xs={12} md={6}>
      <Typography variant="subtitle2" gutterBottom>Date Range</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => handleFilterChange('startDate', date)}
              renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              slotProps={{
                textField: { 
                  fullWidth: true,
                  size: "small",
                  variant: "outlined"
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => handleFilterChange('endDate', date)}
              renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              slotProps={{
                textField: { 
                  fullWidth: true,
                  size: "small",
                  variant: "outlined"
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Grid>
    
    {/* Provenance Filter */}
    <Grid item xs={12} md={6}>
      <Typography variant="subtitle2" gutterBottom>Provenance Type</Typography>
      <FormControl fullWidth size="small" variant="outlined">
        <InputLabel>Provenance Type</InputLabel>
        <Select
          value={filters.selectedProvenance}
          onChange={(e) => handleFilterChange('selectedProvenance', e.target.value)}
          label="Provenance Type"
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {provOptions.map((prov) => (
            <MenuItem key={prov} value={prov}>
              {prov}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    
    {/* Action Buttons */}
    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
      <Button
        variant="outlined"
        startIcon={<RestartAltIcon />}
        onClick={resetFilters}
        sx={{ mr: 1 }}
      >
        Reset
      </Button>
      <Button
        variant="contained"
        onClick={applyFilters}
        color="primary"
      >
        Apply Filters
      </Button>
    </Grid>
  </Grid>
</Card>

        {error && (
          <Alert severity={filtersApplied ? "warning" : "info"} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {data.length === 0 && !error ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            <Typography>Please select filters and click "Apply Filters" to view data</Typography>
          </Box>
        ) : data.length > 0 ? (
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
                displaylogo: false,
                toImageButtonOptions: {
                  format: 'png',
                  filename: 'weight_outliers_chart',
                  height: 500,
                  width: 800
                }
              }}
              style={{ width: '100%', height: '100%' }}
              onClick={(data) => {
                // Handle point clicks
                if (data.points && data.points.length > 0) {
                  const point = data.points[0];
                  // Find the outlier in our original data
                  const clickedOutlier = outliers.find(o => 
                    o.weight === point.y && 
                    (o.prov2?.match(/[A-Za-z]/g)?.join('') === point.data.name || 
                     point.data.name.includes(`ID: ${o.id}`))
                  );
                  
                  if (clickedOutlier) {
                    setSelectedOutlier(clickedOutlier);
                  }
                }
              }}
            />
          </Box>
        ) : null}
        
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
                Outlier Records ({outliers.length} total)
              </Typography>
              
              <Tooltip title="Download Data">
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  size="small"
                  onClick={() => {
                    // Create CSV from outliers data
                    const headers = ['ID', 'Weight', 'Provenance', 'Movement Date'];
                    const csvContent = 
                      headers.join(',') + '\n' + 
                      outliers.map(item => 
                        `${item.id},${item.weight},${item.prov2},${item.movement_Date}`
                      ).join('\n');
                    
                    // Create a downloadable link
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute('download', 'outliers_data.csv');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Export CSV
                </Button>
              </Tooltip>
            </Box>
            
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
                    <TableRow 
                      key={index} 
                      hover
                      onClick={() => setSelectedOutlier(item)}
                      sx={{ 
                        cursor: 'pointer',
                        bgcolor: filters.searchId && item.id === parseInt(filters.searchId, 10) ? 
                          'rgba(255, 235, 59, 0.2)' : 'inherit'
                      }}
                    >
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