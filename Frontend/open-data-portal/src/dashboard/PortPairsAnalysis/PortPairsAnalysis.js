// PortPairsAnalysis.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
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

export default function PortPairsAnalysis() {
  // State for port pairs data
  const [portPairsData, setPortPairsData] = useState([]);
  const [filteredPortPairsData, setFilteredPortPairsData] = useState([]);
  const [allPorts, setAllPorts] = useState([]);
  
  // Filter state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [message, setMessage] = useState("");
  const [embarkationLocations, setEmbarkationLocations] = useState([]);
  const [disembarkationLocations, setDisembarkationLocations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Color palette for charts
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#8884D8', '#82CA9D', '#FF6384', '#36A2EB', 
    '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
  ];

  // Function to fetch port pairs data
  const fetchPortPairsData = async () => {
    try {
      setIsLoading(true);
      
      // Build query params
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString().split('T')[0]);
      if (endDate) params.append('endDate', endDate.toISOString().split('T')[0]);
      if (message) params.append('message', message);
      if (embarkationLocations.length > 0) params.append('embarkationLocations', embarkationLocations.join(','));
      if (disembarkationLocations.length > 0) params.append('disembarkationLocations', disembarkationLocations.join(','));
      
      const url = `http://localhost:8080/apiV1/casestudy/v2/port-pairs${params.toString() ? '?' + params.toString() : ''}`;
      const response = await axios.get(url);
      
      setPortPairsData(response.data);
      setFilteredPortPairsData(response.data);
      
      // Extract all unique ports for filters
      const ports = new Set();
      response.data.forEach(pair => {
        ports.add(pair.embarkationPort);
        ports.add(pair.disembarkationPort);
      });
      setAllPorts(Array.from(ports).sort());
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching port pairs data", error);
      setErrors(prev => ({ ...prev, portPairs: error.message }));
      setIsLoading(false);
    }
  };

  // Function to get top embarkation ports
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

  // Function to get top disembarkation ports
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

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle filters reset
  const handleFiltersReset = () => {
    setStartDate(null);
    setEndDate(null);
    setMessage("");
    setEmbarkationLocations([]);
    setDisembarkationLocations([]);
  };

  // Load data on component mount
  useEffect(() => {
    fetchPortPairsData();
  }, []);

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
        {errors.portPairs && (
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
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            message={message}
            setMessage={setMessage}
            embarkationLocations={embarkationLocations}
            setEmbarkationLocations={setEmbarkationLocations}
            disembarkationLocations={disembarkationLocations}
            setDisembarkationLocations={setDisembarkationLocations}
            allPorts={allPorts}
            onReset={handleFiltersReset}
            onApply={fetchPortPairsData}
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

