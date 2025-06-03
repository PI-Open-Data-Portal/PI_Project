// PortPairsAnalysis.jsx
import React, { useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Box,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import PortPairsFilters from "./PortPairsFilters";
import PortPairsCharts from "./PortPairsCharts";
import PortPairsTable from "./PortPairsTable";

export default function PortPairsAnalysis({ data, filters, setFilters, error }) {
  // Local state
  const [filteredPortPairsData, setFilteredPortPairsData] = useState(data);
  const [showFilters, setShowFilters] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Color palette for charts
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#8884D8', '#82CA9D', '#FF6384', '#36A2EB', 
    '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
  ];

  // Get unique ports for filters
  const allPorts = [...new Set([
    ...data.map(pair => pair.embarkationPort),
    ...data.map(pair => pair.disembarkationPort)
  ])].sort();

  // Functions to get top ports remain the same
  const getTopEmbarkationPorts = useCallback(() => {
    // Group by embarkation port
    const embarkationCounts = {};
    
    filteredPortPairsData.forEach(pair => {
      embarkationCounts[pair.embarkationPort] = (embarkationCounts[pair.embarkationPort] || 0) + pair.count;
    });
    
    // Convert to array, sort and get top 10
    return Object.entries(embarkationCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filteredPortPairsData]);

  const getTopDisembarkationPorts = useCallback(() => {
    // Group by disembarkation port
    const disembarkationCounts = {};
    
    filteredPortPairsData.forEach(pair => {
      disembarkationCounts[pair.disembarkationPort] = (disembarkationCounts[pair.disembarkationPort] || 0) + pair.count;
    });
    
    // Convert to array, sort and get top 10
    return Object.entries(disembarkationCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filteredPortPairsData]);

  // Handlers remain the same
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
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              marginBottom: 2,
              fontFamily: "'Kdam Thmor Pro', sans-serif" 
            }}
          >
            Error loading port pairs data: {error}
          </Alert>
        )}
        
        {showFilters && (
          <PortPairsFilters 
            startDate={filters.startDate}
            setStartDate={(date) => setFilters({ ...filters, startDate: date })}
            endDate={filters.endDate}
            setEndDate={(date) => setFilters({ ...filters, endDate: date })}
            message={filters.message}
            setMessage={(msg) => setFilters({ ...filters, message: msg })}
            embarkationLocations={filters.embarkationLocations}
            setEmbarkationLocations={(locs) => setFilters({ ...filters, embarkationLocations: locs })}
            disembarkationLocations={filters.disembarkationLocations}
            setDisembarkationLocations={(locs) => setFilters({ ...filters, disembarkationLocations: locs })}
            allPorts={allPorts}
            onReset={() => setFilters({ startDate: null, endDate: null, message: "", embarkationLocations: [], disembarkationLocations: [] })}
            onApply={() => setFilteredPortPairsData(data)}
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
          <PortPairsCharts 
            topEmbarkationPorts={getTopEmbarkationPorts()}
            topDisembarkationPorts={getTopDisembarkationPorts()}
            COLORS={COLORS}
          />
        )}

        {tabValue === 1 && (
          <PortPairsTable 
            filteredPortPairsData={filteredPortPairsData}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        )}
      </CardContent>
    </Card>
  );
}

