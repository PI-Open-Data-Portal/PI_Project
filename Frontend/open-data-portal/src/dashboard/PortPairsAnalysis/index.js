import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Box,
  Alert,
  Tabs,
  Tab
} from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';

import PortPairsFilters from "./PortPairsFilters";
import PortPairsCharts from "./PortPairsCharts";
import PortPairsTable from "./PortPairsTable";

export default function PortPairsAnalysis({ portPairsData, allPorts, errors, fetchPortPairsData }) {
  const [showFilters, setShowFilters] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Card elevation={3} sx={{ marginBottom: 4 }}>
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
        {errors?.portPairs && (
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
          <PortPairsFilters 
            allPorts={allPorts}
            onApplyFilters={fetchPortPairsData}
          />
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
            <Tab label="Gráficos" sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }} />
            <Tab label="Data Table" sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }} />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <PortPairsCharts portPairsData={portPairsData} />
        )}

        {tabValue === 1 && (
          <PortPairsTable 
            portPairsData={portPairsData}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
