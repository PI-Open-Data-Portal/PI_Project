import { useEffect, useState } from "react";
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
  Legend
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
  InputAdornment
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export default function UnifiedDashboard() {
  // State for all three components
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
  
  // Color palette
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#8884D8', '#82CA9D', '#FF6384', '#36A2EB', 
    '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
  ];

  const [weightStatisticsData, setWeightStatisticsData] = useState([]);

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
      fetchProvenanceData()
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

      {/* Embarkation Section */}
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

      {/* Product Classification Section */}
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