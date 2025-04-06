import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Typography
} from "@mui/material";

// Import all component sections
import { PortPairsAnalysis } from "./PortPairsAnalysis";
import ProductAnalysis from "./ProductAnalysis";
import ProvenanceAnalysis from "./ProvenanceAnalysis";
import WeightStatistics from "./WeightStatistics";
import EmbarkationChart from "./EmbarkDesembark/EmbarkationChart";
import DesembarkationChart from "./EmbarkDesembark/DesembarkationChart";
import MonthlyProvChart from "./MonthProv/MonthlyProvChart";
import WeightBoxPlotChart from "./BoxPlot/WeightBoxPlotChart";

export default function DashboardContainer() {
  // State for all data
  const [embarkationData, setEmbarkationData] = useState([]);
  const [filteredEmbarkationData, setFilteredEmbarkationData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [provenanceData, setProvenanceData] = useState([]);
  const [weightStatisticsData, setWeightStatisticsData] = useState([]);
  
  // Port pairs data state
  const [portPairsData, setPortPairsData] = useState([]);
  const [filteredPortPairsData, setFilteredPortPairsData] = useState([]);
  const [allPorts, setAllPorts] = useState([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/apiV1/casestudy/weight-statistics")
      .then((response) => response.json())
      .then((data) => {
        const formattedData = [
          { name: "Mean", value: data.meanWeight },
          { name: "Median", value: data.medianWeight },
          { name: "Standard deviation", value: data.stdDevWeight }
        ];
        setWeightStatisticsData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching weight statistics:", error);
        setErrors(prev => ({ ...prev, weightStats: error.message }));
      });
  }, []);

  useEffect(() => {
    Promise.all([
      fetchEmbarkationData(),
      fetchProductData(),
      fetchProvenanceData(),
      fetchPortPairsData()
    ])
      .then(() => setIsLoading(false))
      .catch(err => {
        console.error("Error fetching data:", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = embarkationData.filter(item =>
      item.disembarkationPort.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredEmbarkationData(filtered);
  }, [search, embarkationData]);

  const fetchEmbarkationData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/apiV1/casestudy/embarkation-ports");
      console.log("Received embarkation data:", response.data);
      setEmbarkationData(response.data);
      setFilteredEmbarkationData(response.data);
    } catch (error) {
      console.error("Error fetching embarkation data", error);
      setErrors(prev => ({ ...prev, embarkation: error.message }));
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/apiV1/casestudy/2p-products");
      // Sort data by count in descending order
      const sortedData = response.data.sort((a, b) => b.count - a.count);
      setProductData(sortedData);
    } catch (error) {
      console.error("Error fetching product data", error);
      setErrors(prev => ({ ...prev, product: error.message }));
    }
  };

  const fetchProvenanceData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/apiV1/casestudy/prov2-prefix");
      // Sort data in descending order of count
      const sortedData = response.data.sort((a, b) => b.count - a.count);
      setProvenanceData(sortedData);
    } catch (error) {
      console.error("Error fetching provenance data", error);
      setErrors(prev => ({ ...prev, provenance: error.message }));
    }
  };

  const fetchPortPairsData = async (params = {}) => {
    try {
      setIsLoading(true);
      
      // Build query params from passed object
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate.toISOString().split('T')[0]);
      if (params.endDate) queryParams.append('endDate', params.endDate.toISOString().split('T')[0]);
      if (params.message) queryParams.append('message', params.message);
      if (params.embarkationLocations?.length > 0) queryParams.append('embarkationLocations', params.embarkationLocations.join(','));
      if (params.disembarkationLocations?.length > 0) queryParams.append('disembarkationLocations', params.disembarkationLocations.join(','));
      
      const url = `http://localhost:8080/apiV1/casestudy/v2/port-pairs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
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

  // Render loading state
  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
        sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: '#f4f4f4', 
      minHeight: '100vh', 
      fontFamily: "'Kdam Thmor Pro', sans-serif",
      padding: 2,
    }}>
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{ 
          fontWeight: 600, 
          color: '#2c3e50', 
          marginBottom: 3,
          textAlign: 'center',
          fontFamily: "'Kdam Thmor Pro', sans-serif"
        }}
      >
        Logistics Data Dashboard
      </Typography>
      
      <PortPairsAnalysis 
        portPairsData={filteredPortPairsData}
        allPorts={allPorts}
        errors={errors}
        fetchPortPairsData={fetchPortPairsData}
      />

      <EmbarkationChart
        embarkationData={filteredEmbarkationData}
        search={search}
        setSearch={setSearch}
        errors={errors.embarkation}
      />
      <DesembarkationChart
        embarkationData={filteredEmbarkationData}
        search={search}
        setSearch={setSearch}
        errors={errors.embarkation}
      />
      
      <ProductAnalysis 
        productData={productData}
        errors={errors.product}
      />
      
      <ProvenanceAnalysis 
        provenanceData={provenanceData}
        errors={errors.provenance}
      />
      
      <WeightStatistics 
        weightStatisticsData={weightStatisticsData}
        errors={errors.weightStats}
      />

      <MonthlyProvChart
        provenanceData={provenanceData}
        errors={errors.provenance}
      />

      <WeightBoxPlotChart
        embarkationData={filteredEmbarkationData}
        errors={errors.embarkation}
      />


    </Box>
  );
}