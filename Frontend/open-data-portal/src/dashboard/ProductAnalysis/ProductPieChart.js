import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { ProductCustomTooltip } from '../common/CustomTooltip';

const ProductPieChart = ({ data, colors }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="count"
          label={({ name, percent }) => {
            // Only show label if percentage is significant enough
            if (percent < 0.03) return null;
            const displayName = name.length > 15 
              ? name.substring(0, 15) + '...' 
              : name;
            return `${displayName} (${(percent * 100).toFixed(0)}%)`;
          }}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]} 
            />
          ))}
        </Pie>
        <Tooltip content={<ProductCustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ProductPieChart;
