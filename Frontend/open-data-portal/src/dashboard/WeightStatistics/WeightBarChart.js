import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Alert } from "@mui/material";

const WeightBarChart = ({ data, error }) => {
  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          marginBottom: 2,
          fontFamily: "'Kdam Thmor Pro', sans-serif" 
        }}
      >
        Error loading weight statistics: {error}
      </Alert>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 20, right: 100, left: 100, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal />
        <XAxis
          type="number"
          label={{
            value: 'Value',
            position: 'insideBottomRight',
            offset: -15,
            style: { fontFamily: "'Kdam Thmor Pro', sans-serif" }
          }}
        />
        <YAxis
          dataKey="name"
          type="category"
          width={150}
          tickFormatter={(value) => value || 'Unknown'}
          tick={{
            fontFamily: "'Kdam Thmor Pro', sans-serif"
          }}
        />
        <Tooltip />
        <Legend
          verticalAlign="top"
          height={36}
          wrapperStyle={{
            fontFamily: "'Kdam Thmor Pro', sans-serif"
          }}
        />
        <Bar
          dataKey="value"
          fill="#457884"
          barSize={30}
          label={{
            position: 'right',
            formatter: (value) => value.toLocaleString(),
            style: { 
              fill: 'black', 
              fontSize: '12px',
              fontFamily: "'Kdam Thmor Pro', sans-serif"
            }
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeightBarChart;
