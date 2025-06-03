import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import PortPairsFilters from "./PortPairsAnalysis/PortPairsFilters";

// Import all component sections
import { PortPairsAnalysis } from "./PortPairsAnalysis";
import ProductAnalysis from "./ProductAnalysis";
import ProvenanceAnalysis from "./ProvenanceAnalysis";
import WeightStatistics from "./WeightStatistics";
import EmbarkationChart from "./EmbarkDesembark/EmbarkationChart";
import DesembarkationChart from "./EmbarkDesembark/DesembarkationChart";
import MonthlyProvChart from "./MonthProv/MonthlyProvChart";
import WeightBoxPlotChart from "./BoxPlot/WeightBoxPlotChart";
import LoadingSpinner from "./common/LoadingSpinner";

export default function DashboardContainer() {
  // State for all data
  const [portPairsData, setPortPairsData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [provenanceData, setProvenanceData] = useState([]);
  const [weightData, setWeightData] = useState(null);
  const [monthlyProvData, setMonthlyProvData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Filter states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [message, setMessage] = useState("");
  const [embarkationLocations, setEmbarkationLocations] = useState([]);
  const [disembarkationLocations, setDisembarkationLocations] = useState([]);
  const [isTranshipment, setIsTranshipment] = useState(null);
  const [allPorts, setAllPorts] = useState([]);

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString().split('T')[0]);
    if (endDate) params.append('endDate', endDate.toISOString().split('T')[0]);
    if (message) params.append('message', message);
    if (isTranshipment !== null) params.append('isTranshipment', isTranshipment);
    if (embarkationLocations.length > 0) params.append('embarkationLocations', embarkationLocations.join(','));
    if (disembarkationLocations.length > 0) params.append('disembarkationLocations', disembarkationLocations.join(','));
    return params;
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    const params = buildQueryParams();
    const queryString = params.toString() ? `?${params.toString()}` : '';

    try {
      // Fetch port pairs data
      const portPairsResponse = await axios.get(
        `http://localhost:8080/apiV1/casestudy/v2/port-pairs${queryString}`
      );
      setPortPairsData(portPairsResponse.data);

      // Extract unique ports
      const ports = new Set();
      portPairsResponse.data.forEach(pair => {
        ports.add(pair.embarkationPort);
        ports.add(pair.disembarkationPort);
      });
      setAllPorts(Array.from(ports).sort());

      // Fetch product data
      const productResponse = await axios.get(
        `http://localhost:8080/apiV1/casestudy/2p-products${queryString}`
      );
      setProductData(productResponse.data);

      // Fetch provenance data
      const provenanceResponse = await axios.get(
        `http://localhost:8080/apiV1/casestudy/prov2-prefix${queryString}`
      );
      setProvenanceData(provenanceResponse.data);

      // Fetch weight statistics
      const weightResponse = await axios.get("http://localhost:8080/apiV1/casestudy/weight-statistics");
        const formattedWeightData = [
          { name: "Mean", value: weightResponse.data.meanWeight },
          { name: "Median", value: weightResponse.data.medianWeight },
          { name: "Standard deviation", value: weightResponse.data.stdDevWeight }
        ];
        setWeightData(formattedWeightData);

      // Fetch monthly provenance data
      const monthlyProvResponse = await axios.get(
        `http://localhost:8080/apiV1/casestudy${queryString}`
      );
      setMonthlyProvData(monthlyProvResponse.data);

    } catch (error) {
      setErrors(prev => ({
        ...prev,
        [error.config.url]: error.message
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, []); // Empty dependency array for initial load

  // Handle filter apply
  const handleApply = () => {
    fetchAllData();
  };

  // Handle filter reset
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setMessage("");
    setEmbarkationLocations([]);
    setDisembarkationLocations([]);
    setIsTranshipment(null);
    fetchAllData();
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard data..." />;
  }

  return (
    <Box sx={{ backgroundColor: '#f4f4f4', minHeight: '100vh', padding: 2 }}>
      <Typography
        variant="h3"
        textAlign="center"
        gutterBottom
        sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif", fontWeight: 600, color: '#2c3e50' }}
      >
        Logistics Data Dashboard
      </Typography>

      <PortPairsFilters
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        message={message}
        setMessage={setMessage}
        isTranshipment={isTranshipment}
        setIsTranshipment={setIsTranshipment}
        embarkationLocations={embarkationLocations}
        setEmbarkationLocations={setEmbarkationLocations}
        disembarkationLocations={disembarkationLocations}
        setDisembarkationLocations={setDisembarkationLocations}
        allPorts={allPorts}
        onReset={handleReset}
        onApply={handleApply}
      />

      <PortPairsAnalysis 
        data={portPairsData} 
        filters={{
          startDate,
          endDate,
          embarkationLocations,
          disembarkationLocations
        }}
        error={errors["port-pairs"]}
      />

      <EmbarkationChart 
        data={portPairsData} 
        error={errors["port-pairs"]}
      />

      <DesembarkationChart 
        data={portPairsData} 
        error={errors["port-pairs"]}
      />

      <ProductAnalysis 
        data={productData} 
        error={errors["products"]}
      />

      <ProvenanceAnalysis 
        data={provenanceData} 
        error={errors["provenance"]}
      />
      
      <WeightStatistics 
        data={weightData} 
        error={errors["weight-statistics"]}
      />

      
      {/*
        <MonthlyProvChart 
          data={monthlyProvData} 
          error={errors["monthly-prov"]}
        />
        */}

      <WeightBoxPlotChart 
        data={weightData} 
        error={errors["weight"]}
      />
    </Box>
  );
}
