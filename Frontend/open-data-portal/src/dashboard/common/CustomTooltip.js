import React from 'react';
import { Paper, Typography } from "@mui/material";

// Reusable tooltip component that can be used across different charts
export const CustomTooltip = ({ active, payload, label }) => {
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
          {label || data.name || ''}
        </Typography>
        <Typography 
          variant="body2"
          sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
        >
          {payload[0].name}: {payload[0].value.toLocaleString()}
        </Typography>
      </Paper>
    );
  }
  return null;
};

// Specialized tooltip for Product data
export const ProductCustomTooltip = ({ active, payload }) => {
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

export default CustomTooltip;
