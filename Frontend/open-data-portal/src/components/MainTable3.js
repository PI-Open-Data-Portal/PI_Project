import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import {
  Box, 
  Typography
} from "@mui/material";

export default function ImprovedProvenanceChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/apiV1/casestudy/prov2-prefix');
      // Sort data in descending order of count for better readability
      const sortedData = response.data.sort((a, b) => b.count - a.count);
      setData(sortedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Custom tooltip to show more information
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box 
          sx={{ 
            background: 'white', 
            padding: 2, 
            border: '1px solid #ccc', 
            borderRadius: 2 
          }}
        >
          <Typography variant="subtitle2">
            Prefix: {label}
          </Typography>
          <Typography variant="body2">
            Count: {payload[0].value.toLocaleString()}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ 
      backgroundColor: '#f4f4f4', 
      minHeight: '100%', 
      padding: 3,
      fontFamily: "'Kdam Thmor Pro', sans-serif"
    }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 600, 
          color: '#2c3e50', 
          marginBottom: 3,
          fontFamily: "'Kdam Thmor Pro', sans-serif"
        }}
      >
        Provenance Statistics
      </Typography>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          layout="vertical" 
          data={data} 
          margin={{ top: 20, right: 100, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal />
          <XAxis 
            type="number" 
            domain={[0, 'dataMax']}
            label={{ 
              value: 'Count', 
              position: 'insideBottomRight', 
              offset: -10 
            }}
          />
          <YAxis 
            dataKey="provPrefix" 
            type="category" 
            width={100} 
            tickFormatter={(value) => value || 'Unknown'}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
          />
          <Bar 
            dataKey="count" 
            fill="#457884" 
            barSize={30}
            label={{ 
              position: 'right', 
              formatter: (value) => value.toLocaleString(),
              style: { fill: 'black', fontSize: '12px' }
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}