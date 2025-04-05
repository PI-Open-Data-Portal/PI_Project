import { useCallback } from "react";
import {
  Grid,
  Typography,
  Paper
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

// Color palette
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884D8', '#82CA9D', '#FF6384', '#36A2EB', 
  '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
];

export default function PortPairsCharts({ portPairsData }) {
  // Função para obter os top 10 portos de embarque
  const getTopEmbarkationPorts = useCallback(() => {
    // Agrupar por porto de embarque
    const embarkationCounts = {};
    
    portPairsData.forEach(pair => {
      embarkationCounts[pair.embarkationPort] = (embarkationCounts[pair.embarkationPort] || 0) + pair.count;
    });
    
    // Converter para array, ordenar e pegar os top 10
    return Object.entries(embarkationCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [portPairsData]);

  // Função para obter os top 10 portos de desembarque
  const getTopDisembarkationPorts = useCallback(() => {
    // Agrupar por porto de desembarque
    const disembarkationCounts = {};
    
    portPairsData.forEach(pair => {
      disembarkationCounts[pair.disembarkationPort] = (disembarkationCounts[pair.disembarkationPort] || 0) + pair.count;
    });
    
    // Converter para array, ordenar e pegar os top 10
    return Object.entries(disembarkationCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [portPairsData]);

  // Custom tooltip for Bar charts
  const CustomTooltip = ({ active, payload, label }) => {
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
            {label}
          </Typography>
          <Typography 
            variant="body2"
            sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
          >
            Count: {payload[0].value.toLocaleString()}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Grid container spacing={3}>
      {/* Gráfico de portos de embarque */}
      <Grid item xs={12} md={6}>
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center', 
            mb: 2,
            fontFamily: "'Kdam Thmor Pro', sans-serif"
          }}
        >
          Embarkation Ports
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={getTopEmbarkationPorts()}
            margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={70}
              tick={{ fontFamily: "'Kdam Thmor Pro', sans-serif", fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontFamily: "'Kdam Thmor Pro', sans-serif", fontSize: 12 }}
              label={{ 
                value: 'Quantity', 
                angle: -90, 
                position: 'insideLeft',
                fontFamily: "'Kdam Thmor Pro', sans-serif"
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#457884">
              {getTopEmbarkationPorts().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Grid>
      
      {/* Gráfico de portos de desembarque */}
      <Grid item xs={12} md={6}>
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center', 
            mb: 2,
            fontFamily: "'Kdam Thmor Pro', sans-serif"
          }}
        >
          Desembarkations Ports
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={getTopDisembarkationPorts()}
            margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={70}
              tick={{ fontFamily: "'Kdam Thmor Pro', sans-serif", fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontFamily: "'Kdam Thmor Pro', sans-serif", fontSize: 12 }}
              label={{ 
                value: 'Quantity', 
                angle: -90, 
                position: 'insideLeft',
                fontFamily: "'Kdam Thmor Pro', sans-serif"
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#457884">
              {getTopDisembarkationPorts().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
}
