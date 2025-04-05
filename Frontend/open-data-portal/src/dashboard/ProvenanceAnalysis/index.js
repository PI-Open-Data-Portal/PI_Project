import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Alert } from "@mui/material";
import axios from "axios";
import ProvenanceBarChart from './ProvenanceBarChart';
import LoadingSpinner from '../common/LoadingSpinner';

const ProvenanceAnalysis = () => {
  const [provenanceData, setProvenanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProvenanceData();
  }, []);

  const fetchProvenanceData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8080/apiV1/casestudy/prov2-prefix");
      // Sort data in descending order of count
      const sortedData = response.data.sort((a, b) => b.count - a.count);
      setProvenanceData(sortedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching provenance data", error);
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
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              marginBottom: 2,
              fontFamily: "'Kdam Thmor Pro', sans-serif" 
            }}
          >
            Error loading provenance data: {error}
          </Alert>
        )}
        
        {isLoading ? (
          <LoadingSpinner message="Loading provenance data..." />
        ) : (
          <ProvenanceBarChart data={provenanceData} error={error} />
        )}
      </CardContent>
    </Card>
  );
};

export default ProvenanceAnalysis;
