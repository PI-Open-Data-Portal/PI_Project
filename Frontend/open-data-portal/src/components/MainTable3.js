import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
  LabelList
} from "recharts";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  FormControlLabel,
  Switch,
  Button,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Chip,
  Divider
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearIcon from '@mui/icons-material/Clear';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function UnifiedDashboard() {
  // State for all components - moved all useState hooks to the top
  const [embarkationData, setEmbarkationData] = useState([]);
  const [filteredEmbarkationData, setFilteredEmbarkationData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [provenanceData, setProvenanceData] = useState([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [weightStatisticsData, setWeightStatisticsData] = useState([]);
  
  // Port pairs data state
  const [portPairsData, setPortPairsData] = useState([]);
  const [filteredPortPairsData, setFilteredPortPairsData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [message, setMessage] = useState("");
  const [embarkationLocations, setEmbarkationLocations] = useState([]);
  const [disembarkationLocations, setDisembarkationLocations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [allPorts, setAllPorts] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  
  // Color palette
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#8884D8', '#82CA9D', '#FF6384', '#36A2EB', 
    '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
  ];

  useEffect(() => {
    fetch("http://localhost:8080/apiV1/casestudy/weight-statistics")
      .then((response) => response.json())
      .then((data) => {
        const formattedData = [
          { name: "Mean", value: data.meanWeight },
          { name: "Median", value: data.medianWeight },
          { name: "Standard deviation", value: data.stdDevWeight }
        ];
        setWeightStatisticsData(formattedData);
      })
      .catch((error) => console.error("Erro ao buscar estatísticas de peso:", error));
  }, []);

  useEffect(() => {
    Promise.all([
      fetchEmbarkationData(),
      fetchProductData(),
      fetchProvenanceData(),
      fetchPortPairsData()
    ])
      .then(() => setIsLoading(false))
      .catch(err => {
        console.error("Error fetching data:", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = embarkationData.filter(item =>
      item.disembarkationPort.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredEmbarkationData(filtered);
    setPage(0);
  }, [search, embarkationData]);

  const fetchEmbarkationData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/apiV1/casestudy/embarkation-ports");
      console.log("Received embarkation data:", response.data);
      setEmbarkationData(response.data);
      setFilteredEmbarkationData(response.data);
    } catch (error) {
      console.error("Error fetching embarkation data", error);
      setErrors(prev => ({ ...prev, embarkation: error.message }));
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/apiV1/casestudy/2p-products");
      // Sort data by count in descending order
      const sortedData = response.data.sort((a, b) => b.count - a.count);
      setProductData(sortedData);
    } catch (error) {
      console.error("Error fetching product data", error);
      setErrors(prev => ({ ...prev, product: error.message }));
    }
  };

  const fetchProvenanceData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/apiV1/casestudy/prov2-prefix");
      // Sort data in descending order of count
      const sortedData = response.data.sort((a, b) => b.count - a.count);
      setProvenanceData(sortedData);
    } catch (error) {
      console.error("Error fetching provenance data", error);
      setErrors(prev => ({ ...prev, provenance: error.message }));
    }
  };

  const clearFilters = () => {
    // Limpar os filtros
    setEmbarkationLocations([]);
    setDisembarkationLocations([]);
    
    // Reiniciar os dados filtrados
    setFilteredPortPairsData(portPairsData);
    
    // Se necessário, também pode resetar as variáveis de data e mensagem, caso haja
    setStartDate(null);
    setEndDate(null);
    setMessage('');
    
    // Processar os dados novamente sem os filtros
    processDataForHeatmap(portPairsData);
  };
  

  // Process data for heatmap visualization
  const processDataForHeatmap = (data) => {
    if (!data || data.length === 0) return;
    
    // Get top 10 embarkation and disembarkation ports by frequency
    const embarkCounts = {};
    const disembarkCounts = {};
    
    data.forEach(pair => {
      embarkCounts[pair.embarkationPort] = (embarkCounts[pair.embarkationPort] || 0) + pair.count;
      disembarkCounts[pair.disembarkationPort] = (disembarkCounts[pair.disembarkationPort] || 0) + pair.count;
    });
    
    const topEmbark = Object.entries(embarkCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);
      
    const topDisembark = Object.entries(disembarkCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);
    
    // Create heatmap data for top ports
    const heatmapData = [];
    
    topEmbark.forEach((embark, i) => {
      topDisembark.forEach((disembark, j) => {
        const found = data.find(d => 
          d.embarkationPort === embark && 
          d.disembarkationPort === disembark
        );
        
        heatmapData.push({
          x: j,
          y: i,
          xPort: disembark,
          yPort: embark,
          value: found ? found.count : 0
        });
      });
    });
    
    setHeatmapData(heatmapData);
  };

  // Add this function to fetch the port pairs data
  const fetchPortPairsData = async () => {
    try {
      setIsLoading(true);
      
      // Build query params
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString().split('T')[0]);
      if (endDate) params.append('endDate', endDate.toISOString().split('T')[0]);
      if (message) params.append('message', message);
      if (embarkationLocations.length > 0) params.append('embarkationLocations', embarkationLocations.join(','));
      if (disembarkationLocations.length > 0) params.append('disembarkationLocations', disembarkationLocations.join(','));
      
      const url = `http://localhost:8080/apiV1/casestudy/v2/port-pairs${params.toString() ? '?' + params.toString() : ''}`;
      const response = await axios.get(url);
      
      setPortPairsData(response.data);
      setFilteredPortPairsData(response.data);
      
      // Generate data for heatmap
      processDataForHeatmap(response.data);
      
      // Extract all unique ports for filters
      const ports = new Set();
      response.data.forEach(pair => {
        ports.add(pair.embarkationPort);
        ports.add(pair.disembarkationPort);
      });
      setAllPorts(Array.from(ports).sort());
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching port pairs data", error);
      setErrors(prev => ({ ...prev, portPairs: error.message }));
      setIsLoading(false);
    }
  };

  // Função para obter os top 10 portos de embarque
const getTopEmbarkationPorts = useCallback(() => {
  // Agrupar por porto de embarque
  const embarkationCounts = {};
  
  filteredPortPairsData.forEach(pair => {
    embarkationCounts[pair.embarkationPort] = (embarkationCounts[pair.embarkationPort] || 0) + pair.count;
  });
  
  // Converter para array, ordenar e pegar os top 10
  return Object.entries(embarkationCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}, [filteredPortPairsData]);

// Função para obter os top 10 portos de desembarque
const getTopDisembarkationPorts = useCallback(() => {
  // Agrupar por porto de desembarque
  const disembarkationCounts = {};
  
  filteredPortPairsData.forEach(pair => {
    disembarkationCounts[pair.disembarkationPort] = (disembarkationCounts[pair.disembarkationPort] || 0) + pair.count;
  });
  
  // Converter para array, ordenar e pegar os top 10
  return Object.entries(disembarkationCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}, [filteredPortPairsData]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Custom tooltip for Bar charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper sx={{ 
          p: 2, 
          fontFamily: "'Kdam Thmor Pro', sans-serif"
        }}>
          <Typography 
            variant="subtitle2"
            sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
          >
            {label}
          </Typography>
          <Typography 
            variant="body2"
            sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
          >
            Count: {payload[0].value.toLocaleString()}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  // Custom tooltip for Product data
  const ProductCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper sx={{ 
          p: 2, 
          fontFamily: "'Kdam Thmor Pro', sans-serif"
        }}>
          <Typography 
            variant="subtitle2"
            sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
          >
            {data.nst2007_2PLabelEN}
          </Typography>
          <Typography 
            variant="body2"
            sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
          >
            Count: {data.count.toLocaleString()}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  // Render loading state
  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
        sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Calculate total count for product percentage calculations
  const totalProductCount = productData.reduce((sum, d) => sum + d.count, 0);

  return (
    <Box sx={{ 
      backgroundColor: '#f4f4f4', 
      minHeight: '100vh', 
      fontFamily: "'Kdam Thmor Pro', sans-serif",
      padding: 2,
    }}>
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{ 
          fontWeight: 600, 
          color: '#2c3e50', 
          marginBottom: 3,
          textAlign: 'center',
          fontFamily: "'Kdam Thmor Pro', sans-serif"
        }}
      >
        Logistics Data Dashboard
      </Typography>
      

      <Card 
      elevation={3} 
      sx={{ 
        marginBottom: 4
      }}
    >
      <CardHeader 
        title="Port Pairs Analysis" 
        subheader="Connections between embarkation and disembarkation ports"
        titleTypographyProps={{
          sx: { 
            fontFamily: "'Kdam Thmor Pro', sans-serif",
            color: '#2c3e50',
            fontWeight: 600
          }
        }}
        subheaderTypographyProps={{
          sx: { fontFamily: "'Kdam Thmor Pro', sans-serif" }
        }}
        action={
          <IconButton 
            onClick={() => setShowFilters(!showFilters)}
            aria-label="filter"
          >
            <FilterListIcon />
          </IconButton>
        }
      />
      <CardContent>
        {errors.portPairs && (
          <Alert 
            severity="error" 
            sx={{ 
              marginBottom: 2,
              fontFamily: "'Kdam Thmor Pro', sans-serif" 
            }}
          >
            Error loading port pairs data: {errors.portPairs}
          </Alert>
        )}
        
        {showFilters && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                fontFamily: "'Kdam Thmor Pro', sans-serif",
                color: '#2c3e50' 
              }}
            >
              Filters
            </Typography>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        slotProps={{ 
                          textField: { 
                            fullWidth: true,
                            size: "small",
                            sx: { fontFamily: "'Kdam Thmor Pro', sans-serif" }
                          } 
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        slotProps={{ 
                          textField: { 
                            fullWidth: true,
                            size: "small",
                            sx: { fontFamily: "'Kdam Thmor Pro', sans-serif" }
                          } 
                        }}
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Message"
                  fullWidth
                  size="small"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                />
              </Grid>
              
              <Grid item xs={12} md={5}>
                <FormControl fullWidth size="small">
                  <InputLabel id="embark-label" sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
                    Embarkation Ports
                  </InputLabel>
                  <Select
                    labelId="embark-label"
                    multiple
                    value={embarkationLocations}
                    onChange={(e) => setEmbarkationLocations(e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip 
                            key={value} 
                            label={value} 
                            size="small"
                            sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {allPorts.map((port) => (
                      <MenuItem 
                        key={port} 
                        value={port}
                        sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                      >
                        {port}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <FormControl fullWidth size="small">
                  <InputLabel id="disembark-label" sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
                    Disembarkation Ports
                  </InputLabel>
                  <Select
                    labelId="disembark-label"
                    multiple
                    value={disembarkationLocations}
                    onChange={(e) => setDisembarkationLocations(e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip 
                            key={value} 
                            label={value} 
                            size="small"
                            sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {allPorts.map((port) => (
                      <MenuItem 
                        key={port} 
                        value={port}
                        sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                      >
                        {port}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControlLabel
                  control={
                    <Switch

                    />
                  }
                  label="Is Transhipment"
                  sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                />
              </Grid>
              
              <Grid item xs={12} display="flex" justifyContent="flex-end" gap={1}>
                <Button 
                  variant="outlined" 
                  startIcon={<ClearIcon />}
                  onClick={() => {
                    setStartDate(null);
                    setEndDate(null);
                    setMessage("");
                    setEmbarkationLocations([]);
                    setDisembarkationLocations([]);
                    clearFilters();
                    
                  }}
                  sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                >
                  Clear
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={fetchPortPairsData}
                  sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider', 
          marginBottom: 2,
          fontFamily: "'Kdam Thmor Pro', sans-serif"
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            centered
            sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
          >
            <Tab label="Heatmap" sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }} />
            <Tab label="Gráficos" sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }} />
            <Tab label="Data Table" sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }} />
          </Tabs>
        </Box>

        

        {/* Heatmap Visualization */}
{tabValue === 0 && (
  <Box sx={{ height: 500, width: '100%' }}>
    <Typography 
      variant="body2" 
      sx={{ 
        textAlign: 'center', 
        mb: 0,
        fontFamily: "'Kdam Thmor Pro', sans-serif"
      }}
    >
      Heatmap of top 10 embarkation and disembarkation ports (intensity indicates frequency)
    </Typography>
    <ResponsiveContainer width="100%" height="90%">
      <ScatterChart
        margin={{ top: 60, right: 20, bottom: 20, left: 100 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          dataKey="x" 
          name="Disembarkation Port" 
          tick={false}
          axisLine={true}
          domain={[-1, 10]}
        />
        <YAxis 
          type="number" 
          dataKey="y" 
          name="Embarkation Port" 
          tick={false}
          axisLine={true}
          domain={[-1, 10]}
        />
        <ZAxis 
          type="number" 
          dataKey="value" 
          range={[100, 800]} 
          name="count" 
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length > 0) {
              const data = payload[0].payload;
              return (
                <div style={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #ccc',
                  padding: '12px 15px',
                  borderRadius: '4px',
                  fontSize: '16px', // Larger font for tooltip
                  fontFamily: "'Kdam Thmor Pro', sans-serif",
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                }}>
                  {`${data.xPort} -> ${data.yPort} : ${data.value}`}
                </div>
              );
            }
            return null;
          }}
        />
        
        <Scatter 
          name="count" 
          data={heatmapData} 
          fill="#8884d8"
          shape="square"
          fillOpacity={0.8}
        >
          {heatmapData.map((entry, index) => {
            // Color based on value
            const maxValue = Math.max(...heatmapData.map(d => d.value));
            const colorIndex = Math.floor((entry.value / maxValue) * (COLORS.length - 1));
            
            return (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.value > 0 ? COLORS[colorIndex % COLORS.length] : '#f5f5f5'} 
              />
            );
          })}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  </Box>
)}
{tabValue === 1 && (
  <Grid container spacing={3}>
    {/* Gráfico de portos de embarque */}
    <Grid item xs={12} md={6}>
      <Typography 
        variant="h6" 
        sx={{ 
          textAlign: 'center', 
          mb: 2,
          fontFamily: "'Kdam Thmor Pro', sans-serif"
        }}
      >
        Embarkation Ports
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={getTopEmbarkationPorts()}
          margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={70}
            tick={{ fontFamily: "'Kdam Thmor Pro', sans-serif", fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontFamily: "'Kdam Thmor Pro', sans-serif", fontSize: 12 }}
            label={{ 
              value: 'Quantity', 
              angle: -90, 
              position: 'insideLeft',
              fontFamily: "'Kdam Thmor Pro', sans-serif"
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#457884">
            {getTopEmbarkationPorts().map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Grid>
    
    {/* Gráfico de portos de desembarque */}
    <Grid item xs={12} md={6}>
      <Typography 
        variant="h6" 
        sx={{ 
          textAlign: 'center', 
          mb: 2,
          fontFamily: "'Kdam Thmor Pro', sans-serif"
        }}
      >
        Desembarkations Ports
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={getTopDisembarkationPorts()}
          margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={70}
            tick={{ fontFamily: "'Kdam Thmor Pro', sans-serif", fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontFamily: "'Kdam Thmor Pro', sans-serif", fontSize: 12 }}
            label={{ 
              value: 'Quantity', 
              angle: -90, 
              position: 'insideLeft',
              fontFamily: "'Kdam Thmor Pro', sans-serif"
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#457884">
            {getTopDisembarkationPorts().map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Grid>
  </Grid>
)}


        {/* Data Table */}
        {tabValue === 2 && (
          <TableContainer 
            component={Paper}
            sx={{ 
              maxHeight: 500,
              fontFamily: "'Kdam Thmor Pro', sans-serif"
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    fontWeight: 'bold',
                    fontFamily: "'Kdam Thmor Pro', sans-serif",
                    backgroundColor: '#457884',
                    color: 'white'
                  }}>
                    Embarkation Port
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold',
                    fontFamily: "'Kdam Thmor Pro', sans-serif",
                    backgroundColor: '#457884',
                    color: 'white'
                  }}>
                    Disembarkation Port
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold',
                    fontFamily: "'Kdam Thmor Pro', sans-serif",
                    backgroundColor: '#457884',
                    color: 'white'
                  }}>
                    Count
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPortPairsData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow 
                      key={`${item.embarkationPort}-${item.disembarkationPort}`}
                      hover
                      sx={{ 
                        backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white'
                      }}
                    >
                      <TableCell sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
                        {item.embarkationPort}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
                        {item.disembarkationPort}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
                        {item.count.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredPortPairsData.length === 0 && (
                  <TableRow>
                    <TableCell 
                      colSpan={3} 
                      align="center"
                      sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                    >
                      No data available. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredPortPairsData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
                }}
                sx={{
                fontFamily: "'Kdam Thmor Pro', sans-serif"
                }}
              />
              </TableContainer>
            )}
            </CardContent>
          </Card>

            {/* Embarkation Section */}
            {/* 
            <Card 
            elevation={3} 
            sx={{ 
              marginBottom: 4, 
              overflow: 'visible'
            }}
            >
            <CardHeader 
              title="Shipments by Disembarkation Port" 
              titleTypographyProps={{
              sx: { 
                fontFamily: "'Kdam Thmor Pro', sans-serif",
                color: '#2c3e50',
                fontWeight: 600
              }
              }}
            />
            <CardContent>
              <TextField
              fullWidth
              variant="outlined"
              label="Search by Disembarkation Port"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
                ),
                sx: {
                borderRadius: 2,
                fontFamily: "'Kdam Thmor Pro', sans-serif",
                marginBottom: 2
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                fontFamily: "'Kdam Thmor Pro', sans-serif",
                '& fieldset': {
                  borderColor: '#457884',
                },
                '&:hover fieldset': {
                  borderColor: '#3a6d6d',
                },
                }
              }}
              />
              
              {errors.embarkation && (
              <Alert 
                severity="error" 
                sx={{ 
                marginBottom: 2,
                fontFamily: "'Kdam Thmor Pro', sans-serif" 
                }}
              >
                Error loading embarkation data: {errors.embarkation}
              </Alert>
              )}
              
              <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: '#457884',
                    fontFamily: "'Kdam Thmor Pro', sans-serif"
                    }}>
                    Disembarkation Port
                    </TableCell>
                    <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: '#457884',
                    fontFamily: "'Kdam Thmor Pro', sans-serif"
                    }}>
                    Quantity
                    </TableCell>
                  </TableRow>
                  </TableHead>
                  <TableBody>
                  {filteredEmbarkationData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                    <TableRow 
                      key={item.disembarkationPort}
                      hover
                    >
                      <TableCell sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
                      {item.disembarkationPort}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
                      {item.count}
                      </TableCell>
                    </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 15]}
                  component="div"
                  count={filteredEmbarkationData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(e) => setRowsPerPage(+e.target.value)}
                  sx={{
                  '& .MuiTablePagination-toolbar': {
                    color: '#457884',
                    fontFamily: "'Kdam Thmor Pro', sans-serif"
                  }
                  }}
                />
                </TableContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart data={filteredEmbarkationData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e0e0e0" 
                  />
                  <XAxis 
                    dataKey="disembarkationPort" 
                    tick={{ 
                    fontSize: 10,
                    fontFamily: "'Kdam Thmor Pro', sans-serif"
                    }} 
                    angle={-45} 
                    textAnchor="end" 
                    stroke="#457884"
                  />
                  <YAxis 
                    stroke="#457884" 
                    label={{ 
                    angle: -90, 
                    position: 'insideLeft',
                    fontFamily: "'Kdam Thmor Pro', sans-serif"
                    }} 
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} 
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#1976d2" 
                    barSize={30} 
                  />
                  </BarChart>
                </ResponsiveContainer>
                </Box>
              </Grid>
              </Grid>
            </CardContent>
            </Card>
            }}*/}
      <Card 
        elevation={3} 
        sx={{ 
          marginBottom: 4
        }}
      >
        <CardHeader 
          title="Product Classification Analysis" 
          subheader="Distribution of Products by Category"
          titleTypographyProps={{
            sx: { 
              fontFamily: "'Kdam Thmor Pro', sans-serif",
              color: '#2c3e50',
              fontWeight: 600
            }
          }}
          subheaderTypographyProps={{
            sx: { fontFamily: "'Kdam Thmor Pro', sans-serif" }
          }}
        />
        <CardContent>
          {errors.product && (
            <Alert 
              severity="error" 
              sx={{ 
                marginBottom: 2,
                fontFamily: "'Kdam Thmor Pro', sans-serif" 
              }}
            >
              Error loading product data: {errors.product}
            </Alert>
          )}
          
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider', 
            marginBottom: 2,
            fontFamily: "'Kdam Thmor Pro', sans-serif"
          }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              centered
              sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
            >
              <Tab label="Bar Chart" sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }} />
              <Tab label="Pie Chart" sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }} />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="nst2007_2PLabelEN" 
                  interval={0}
                  height={150}
                  tick={({ payload, x, y }) => (
                    <g transform={`translate(${x},${y})`}>
                      <text 
                        x={0} 
                        y={0} 
                        dy={10} 
                        textAnchor="end" 
                        fill="#666"
                        transform="rotate(-45)"
                        style={{ 
                          fontFamily: "'Kdam Thmor Pro', sans-serif",
                          fontSize: '0.7rem'
                        }}
                      >
                        {payload.value.length > 20 
                          ? payload.value.substring(0, 20) + '...' 
                          : payload.value}
                      </text>
                    </g>
                  )}
                />
                <YAxis />
                <Tooltip content={<ProductCustomTooltip />} />
                <Bar dataKey="count" fill="#8884d8">
                  {productData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {tabValue === 1 && (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => {
                    const displayName = name.length > 15 
                      ? name.substring(0, 15) + '...' 
                      : name;
                    return;
                  }}
                >
                  {productData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<ProductCustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}

          <TableContainer 
            component={Paper} 
            sx={{ 
              marginTop: 2,
              maxHeight: 300,
              fontFamily: "'Kdam Thmor Pro', sans-serif" 
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
                    Product Category
                  </TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                  >
                    Percentage
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productData.map((item, index) => {
                  const percentage = ((item.count / totalProductCount) * 100).toFixed(2);
                  
                  return (
                    <TableRow 
                      key={item.nst2007_2P}
                      hover
                    >
                      <TableCell 
                        component="th" 
                        scope="row"
                        sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            sx={{
                              width: 10, 
                              height: 10, 
                              borderRadius: '50%', 
                              backgroundColor: COLORS[index % COLORS.length],
                            }} 
                          />
                          {item.nst2007_2PLabelEN}
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                      >
                        {percentage}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Provenance Section */}
      <Card 
        elevation={3} 
        sx={{ 
          marginBottom: 4
        }}
      >
        <CardHeader 
          title="Provenance Statistics" 
          titleTypographyProps={{
            sx: { 
              fontFamily: "'Kdam Thmor Pro', sans-serif",
              color: '#2c3e50',
              fontWeight: 600
            }
          }}
        />
        <CardContent>
          {errors.provenance && (
            <Alert 
              severity="error" 
              sx={{ 
                marginBottom: 2,
                fontFamily: "'Kdam Thmor Pro', sans-serif" 
              }}
            >
              Error loading provenance data: {errors.provenance}
            </Alert>
          )}
          
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              layout="vertical"
              data={provenanceData}
              margin={{ top: 20, right: 100, left: 100, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal />
              <XAxis
                type="number"
                label={{
                  value: 'Count',
                  position: 'insideBottomRight',
                  offset: -15,
                  style: { fontFamily: "'Kdam Thmor Pro', sans-serif" }
                }}
              />
              <YAxis
                dataKey="provPrefix"
                type="category"
                width={100}
                tickFormatter={(value) => value || 'Unknown'}
                tick={{
                  fontFamily: "'Kdam Thmor Pro', sans-serif"
                }}
              />
              <Tooltip />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{
                  fontFamily: "'Kdam Thmor Pro', sans-serif"
                }}
              />
              <Bar
                dataKey="count"
                fill="#457884"
                barSize={30}
                label={{
                  position: 'right',
                  formatter: (value) => value.toLocaleString(),
                  style: { 
                    fill: 'black', 
                    fontSize: '12px',
                    fontFamily: "'Kdam Thmor Pro', sans-serif"
                  }
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card 
  elevation={3} 
  sx={{ 
    marginBottom: 4
  }}
>
<CardHeader 
          title="Weight Statistics" 
          titleTypographyProps={{
            sx: { 
              fontFamily: "'Kdam Thmor Pro', sans-serif",
              color: '#2c3e50',
              fontWeight: 600
            }
          }}
        />
  <CardContent>
    
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        layout="vertical"
        data={weightStatisticsData}
        margin={{ top: 20, right: 100, left: 100, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal />
        <XAxis
          type="number"
          label={{
            value: 'Value',
            position: 'insideBottomRight',
            offset: -15,
            style: { fontFamily: "'Kdam Thmor Pro', sans-serif" }
          }}
        />
        <YAxis
          dataKey="name"
          type="category"
          width={150}
          tickFormatter={(value) => value || 'Unknown'}
          tick={{
            fontFamily: "'Kdam Thmor Pro', sans-serif"
          }}
        />
        <Tooltip />
        <Legend
          verticalAlign="top"
          height={36}
          wrapperStyle={{
            fontFamily: "'Kdam Thmor Pro', sans-serif"
          }}
        />
        <Bar
          dataKey="value"
          fill="#457884"
          barSize={30}
          label={{
            position: 'right',
            formatter: (value) => value.toLocaleString(),
            style: { 
              fill: 'black', 
              fontSize: '12px',
              fontFamily: "'Kdam Thmor Pro', sans-serif"
            }
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>

    </Box>

  );
}