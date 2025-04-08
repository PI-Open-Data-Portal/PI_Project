import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Box, 
  Tabs, 
  Tab, 
  Alert 
} from "@mui/material";
import axios from "axios";
import ProductBarChart from './ProductBarChart';
import ProductPieChart from './ProductPieChart';
import ProductTable from './ProductTable';
import LoadingSpinner from '../common/LoadingSpinner';

// Color palette
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884D8', '#82CA9D', '#FF6384', '#36A2EB', 
  '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
];

const ProductAnalysis = () => {
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8080/apiV1/casestudy/2p-products");
      // Sort data by count in descending order
      const sortedData = response.data.sort((a, b) => b.count - a.count);
      setProductData(sortedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching product data", error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
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
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              marginBottom: 2,
              fontFamily: "'Kdam Thmor Pro', sans-serif" 
            }}
          >
            Error loading product data: {error}
          </Alert>
        )}
        
        {isLoading ? (
          <LoadingSpinner message="Loading product data..." />
        ) : (
          <>
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

            {tabValue === 0 && <ProductBarChart data={productData} colors={COLORS} />}
            {tabValue === 1 && <ProductPieChart data={productData} colors={COLORS} />}
            
            <ProductTable data={productData} colors={COLORS} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductAnalysis;
