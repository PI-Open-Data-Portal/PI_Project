import {useState,React} from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Avatar, 
  Chip,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  LinearProgress,
  Pagination,
  Stack,
  Slider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from "react-router-dom";


const W3Canalysis = () => {
// Dados fictícios para cada tabela
const tableData = {
  tabela1: [
    {
      id: 1,
      description: 'View with information about the manifest and containers',
      type: 'View',
      resource_path: 'PRJ_LEI_2025.dbo.VW_Contentores_Manifesto_PROV',
      creation_date: '2025-03-31 10:57:42.000',
      command_text:null,
      id_activity: 101
    }
  ],
  tabela2: [
    {
      id: "MC1",
      description: 'Manual Classification',
      type: 'Person',
      started_date: '2025-03-31 10:57:42.000',
      end_date: '2025-03-31 10:57:42.000'
    }
  ],
  tabela3: [
    {
      id: 3,
      description: 'Person',
      type: 'Data Scientist'
    }
  ]
};


const tableColumns = {
  tabela1: ['id', 'description', 'type', 'resource_path', 'creation_date', 'command_text','id_activity'],
  tabela2: ['id', 'description', 'type', 'started_date', 'end_date'],
  tabela3: ['id', 'description', 'type']
};
const [selectedTable, setSelectedTable] = useState('tabela1');

  const data = tableData[selectedTable];
  const columns = tableColumns[selectedTable];
  return (
    <><Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          W3C Analyses
      </Typography>
       <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Tabela: {selectedTable}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small">
            <InputLabel id="select-tabela-label">Tabela</InputLabel>
            <Select
              labelId="select-tabela-label"
              value={selectedTable}
              label="Tabela"
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              <MenuItem value="tabela1">Entity</MenuItem>
              <MenuItem value="tabela2">Activity</MenuItem>
              <MenuItem value="tabela3">Agent</MenuItem>
            </Select>
          </FormControl>
          
        </Box>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => (
                  <TableCell key={col}>{row[col]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="outlined">See All</Button>
      </Box>
    </Paper>
      </>
  );
};

export default W3Canalysis;