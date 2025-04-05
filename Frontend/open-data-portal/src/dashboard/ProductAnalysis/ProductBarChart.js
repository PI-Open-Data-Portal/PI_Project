import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer
} from "recharts";
import { ProductCustomTooltip } from '../common/CustomTooltip';

const ProductBarChart = ({ data, colors }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="nst2007_2PLabelEN" 
          interval={0}
          height={150}
          tick={({ payload, x, y }) => (
            <g transform={`translate(${x},${y})`}>
              <text 
                x={0} 
                y={0} 
                dy={10} 
                textAnchor="end" 
                fill="#666"
                transform="rotate(-45)"
                style={{ 
                  fontFamily: "'Kdam Thmor Pro', sans-serif",
                  fontSize: '0.7rem'
                }}
              >
                {payload.value.length > 20 
                  ? payload.value.substring(0, 20) + '...' 
                  : payload.value}
              </text>
            </g>
          )}
        />
        <YAxis />
        <Tooltip content={<ProductCustomTooltip />} />
        <Bar dataKey="count" fill="#8884d8">
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProductBarChart;
