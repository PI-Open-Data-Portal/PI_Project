import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  CircularProgress, 
  Tab, 
  Tabs, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Alert,
  Tooltip as MUITooltip
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';

const ProductClassificationVisualizer = () => {
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Color palette
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#8884D8', '#82CA9D', '#FF6384', '#36A2EB', 
    '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
  ];

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8080/apiV1/casestudy/2p-products');
        
        // Sort data by count in descending order
        const sortedData = response.data.sort((a, b) => b.count - a.count);
        
        setProductData(sortedData);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
        console.error('Error fetching product data:', err);
      }
    };

    fetchProductData();
  }, []);

  // Improved label truncation with tooltip
  const LabelWithTooltip = ({ label, maxLength = 20 }) => {
    const isLong = label.length > maxLength;
    const displayLabel = isLong ? label.substring(0, maxLength) + '...' : label;

    return isLong ? (
      <MUITooltip title={label} placement="top">
        <span style={{ 
          fontFamily: "'Kdam Thmor Pro', sans-serif",
          cursor: 'help'
        }}>
          {displayLabel}
        </span>
      </MUITooltip>
    ) : (
      <span style={{ 
        fontFamily: "'Kdam Thmor Pro', sans-serif"
      }}>
        {displayLabel}
      </span>
    );
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Custom tooltip for Bar and Pie charts
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
        height={400}
        sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
      >
        Error fetching data: {error.message}
      </Alert>
    );
  }

  // Calculate total count for percentage calculations
  const totalCount = productData.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card 
      sx={{ 
        width: '100%', 
        maxWidth: 1200, 
        margin: 'auto',
        fontFamily: "'Kdam Thmor Pro', sans-serif"
      }}
    >
      <CardHeader 
        title="Product Classification Analysis" 
        subheader="Distribution of Products by Category"
        titleTypographyProps={{
          sx: { fontFamily: "'Kdam Thmor Pro', sans-serif" }
        }}
        subheaderTypographyProps={{
          sx: { fontFamily: "'Kdam Thmor Pro', sans-serif" }
        }}
      />
      <CardContent>
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
            <Tab label="Bar Chart" />
            <Tab label="Pie Chart" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={productData}>
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
                      <LabelWithTooltip label={payload.value} maxLength={20} />
                    </text>
                  </g>
                )}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36} 
                layout="horizontal" 
                wrapperStyle={{
                  display: 'none' // Remover a legenda roxa de count
                }}
              />
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
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ name, percent, x, y, midAngle }) => {
                  const labelProps = {
                    x,
                    y,
                    textAnchor: x > midAngle ? 'start' : 'end',
                    dominantBaseline: 'central',
                    style: { 
                      fontFamily: "'Kdam Thmor Pro', sans-serif",
                      fontSize: '0.7rem'
                    }
                  };

                  return (
                    <text {...labelProps}>
                      <LabelWithTooltip 
                        label={`${name} ${(percent * 100).toFixed(0)}%`} 
                        maxLength={15} 
                      />
                    </text>
                  );
                }}
              >
                {productData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}

        <TableContainer 
          component={Paper} 
          sx={{ 
            marginTop: 0,  // Aproximei a tabela do gráfico removendo o espaçamento
            fontFamily: "'Kdam Thmor Pro', sans-serif" 
          }}
        >
          <Table>
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
                const percentage = ((item.count / totalCount) * 100).toFixed(2);
                
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
                            marginRight: 1
                          }} 
                        />
                        <LabelWithTooltip label={item.nst2007_2PLabelEN} maxLength={50} />
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
  );
};

export default ProductClassificationVisualizer;
