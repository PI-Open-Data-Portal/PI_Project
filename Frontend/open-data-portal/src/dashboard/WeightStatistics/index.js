import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Alert } from "@mui/material";
import axios from "axios";
import WeightBarChart from './WeightBarChart';
import LoadingSpinner from '../common/LoadingSpinner';

const WeightStatistics = () => {
  const [weightStatisticsData, setWeightStatisticsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeightStatistics();
  }, []);

  const fetchWeightStatistics = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8080/apiV1/casestudy/weight-statistics");
      const formattedData = [
        { name: "Mean", value: response.data.meanWeight },
        { name: "Median", value: response.data.medianWeight },
        { name: "Standard deviation", value: response.data.stdDevWeight }
      ];
      setWeightStatisticsData(formattedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching weight statistics:", error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
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
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              marginBottom: 2,
              fontFamily: "'Kdam Thmor Pro', sans-serif" 
            }}
          >
            Error loading weight statistics: {error}
          </Alert>
        )}
        
        {isLoading ? (
          <LoadingSpinner message="Loading weight statistics..." />
        ) : (
          <WeightBarChart data={weightStatisticsData} error={error} />
        )}
      </CardContent>
    </Card>
  );
};

export default WeightStatistics;
