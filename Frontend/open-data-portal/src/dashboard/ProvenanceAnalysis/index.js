import React from 'react';
import { Card, CardHeader, CardContent, Alert } from "@mui/material";
import ProvenanceBarChart from './ProvenanceBarChart';

const ProvenanceAnalysis = ({ data, error }) => {
  return (
    <Card elevation={3} sx={{ marginBottom: 4 }}>
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
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            Error loading provenance data: {error}
          </Alert>
        )}
        
        <ProvenanceBarChart data={data} error={error} />
      </CardContent>
    </Card>
  );
};

export default ProvenanceAnalysis;
