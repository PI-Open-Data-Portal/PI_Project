import React from 'react';
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingSpinner = ({ message = "Loading data..." }) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      height="100%"
      minHeight="300px"
      sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
    >
      <CircularProgress size={50} sx={{ color: "#457884", mb: 2 }} />
      <Typography 
        variant="body1" 
        sx={{ 
          fontFamily: "'Kdam Thmor Pro', sans-serif",
          color: "#2c3e50" 
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
