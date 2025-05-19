import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Paper, Typography, Grid } from '@mui/material';



const agents = [
  { id: 1, type: 'Person' },
  { id: 2, type: 'Person' },
  { id: 3, type: 'Person' },
  { id: 4, type: 'Person' },
  { id: 5, type: 'test1' },
  { id: 6, type: 'test1' },
  { id: 7, type: 'test2' },

];


const tabela2 = [
  { id: 1, description: 'T', type: 'Batch'},
  { id: 2, description: 'T', type: 'Batch'},
  { id: 3, description: 'ML-April', type: 'Batch'},
  { id: 4, description: 'ML-April', type: 'Batch'},
  { id: 5, description: 'ML-May', type: 'Batch'},
  { id: 6, description: 'C-April', type: 'Batch'},
  { id: 7, description: 'C-May', type: 'Batch'},
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA66CC'];


const countBy = (array, key) => {
  const counts = array.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
};


export default function W3CanalysisGraphs() {
   const agentsData = countBy(agents, 'type');
  const tabela2Data = countBy(tabela2, 'description');
  return (
     <Paper elevation={3} sx={{ p: 3, borderRadius: 2 ,mt:4}}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Estatísticas Visuais
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ mb: 1, textAlign: 'center' }}>
            Agents por Tipo
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={agentsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {agentsData.map((entry, index) => (
                  <Cell key={`a-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} agentes`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ mb: 1, textAlign: 'center' }}>
            Tipos de Atividades
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tabela2Data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {tabela2Data.map((entry, index) => (
                  <Cell key={`b-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} entradas`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Paper>

  );
}
