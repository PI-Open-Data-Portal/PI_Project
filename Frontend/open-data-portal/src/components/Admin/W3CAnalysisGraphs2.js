import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const tabela1 = [
  { id: 1, description: 'Command X', type: 'Download-Data casestudy1', resource_path: '/x', creation_date: '2024-05-01', command_text_id_activity: 101 },
  { id: 2, description: 'Command Y', type: 'Download-Data casestudy1', resource_path: '/y', creation_date: '2024-05-02', command_text_id_activity: 102 },
  { id: 3, description: 'Command Z', type: 'Download-Data casestudy2', resource_path: '/z', creation_date: '2024-05-03', command_text_id_activity: 103 },
  { id: 4, description: 'Command W', type: 'Download-Data casestudy2', resource_path: '/w', creation_date: '2024-05-04', command_text_id_activity: 104 },
  { id: 5, description: 'Command V', type: 'View casestudy1', resource_path: '/v', creation_date: '2024-05-05', command_text_id_activity: 105 },
  { id: 5, description: 'Command V', type: 'View casestudy1', resource_path: '/v', creation_date: '2024-05-05', command_text_id_activity: 105 },
  { id: 5, description: 'Command V', type: 'View casestudy2', resource_path: '/v', creation_date: '2024-05-05', command_text_id_activity: 105 },
  { id: 5, description: 'Command V', type: 'View casestudy2', resource_path: '/v', creation_date: '2024-05-05', command_text_id_activity: 105 },
  { id: 5, description: 'Command V', type: 'Upload Data', resource_path: '/v', creation_date: '2024-05-05', command_text_id_activity: 105 },

];

// Agrupar por tipo
const typeCounts = tabela1.reduce((acc, item) => {
  acc[item.type] = (acc[item.type] || 0) + 1;
  return acc;
}, {});

const data = Object.entries(typeCounts).map(([type, count]) => ({
  type,
  count,
}));

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function W3CAnalysisGraphs2() {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Tipos de acções no sistema no ultimos 30 dias
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#0088FE">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
