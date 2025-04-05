// PortPairsCharts.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { Grid, Typography, Paper } from "@mui/material";

export default function PortPairsCharts({ topEmbarkationPorts, topDisembarkationPorts, COLORS }) {
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
      {/* Embarkation Ports Chart */}
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
            data={topEmbarkationPorts}
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
              {topEmbarkationPorts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Grid>
      
      {/* Disembarkation Ports Chart */}
      <Grid item xs={12} md={6}>
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center', 
            mb: 2,
            fontFamily: "'Kdam Thmor Pro', sans-serif"
          }}
        >
          Disembarkation Ports
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={topDisembarkationPorts}
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
              {topDisembarkationPorts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
}