import React, { useRef, useEffect } from "react";
import {
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Button,
  FormControlLabel,
  Switch,
  Typography
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';

// Lista de tipos de mensagem válidos
const MESSAGE_TYPES = [
  "ARRIVAL_ANNOUNCEMENT", 
  "ARRIVAL_GUIDE", 
  "DECONSOLIDATION_GUIDE", 
  "DEPARTURE_GUIDE", 
  "DISEMBARKATION_REPORT", 
  "EMBARKATION_REPORT", 
  "LOAD_INSTRUCTION", 
  "LOAD_REPORT", 
  "UNLOAD_INSTRUCTION", 
  "UNLOAD_REPORT", 
  "VERIFIED_WEIGHING"
];

export default function PortPairsFilters({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  message,
  setMessage,
  embarkationLocations,
  setEmbarkationLocations,
  disembarkationLocations,
  setDisembarkationLocations,
  allPorts,
  onReset,
  onApply
}) {
  // Ref para o botão de Apply Filters
  const applyButtonRef = useRef(null);

  // Nova função que simula "dois cliques" no botão Clear
  const handleDoubleClick = () => {
    // Primeiro limpa todos os filtros
    setStartDate(null);
    setEndDate(null);
    setMessage("");
    setEmbarkationLocations([]);
    setDisembarkationLocations([]);
    
    // Em seguida, simula um clique no botão Apply
    // Opção 1: Chama diretamente a função onApply
    // onApply();
    
    // Opção 2 (alternativa): Simula um clique físico no botão Apply
    // Se por algum motivo a opção 1 não funcionar, você pode descomentar este código
     setTimeout(() => {
       if (applyButtonRef.current) {
        applyButtonRef.current.click();
       }
     }, 100);
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2, 
          fontFamily: "'Kdam Thmor Pro', sans-serif",
          color: '#2c3e50' 
        }}
      >
        Filters
      </Typography>
      
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      size: "small",
                      sx: { fontFamily: "'Kdam Thmor Pro', sans-serif" }
                    } 
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      size: "small",
                      sx: { fontFamily: "'Kdam Thmor Pro', sans-serif" }
                    } 
                  }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="message-label" sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
              Message Type
            </InputLabel>
            <Select
              labelId="message-label"
              value={message}
              label="Message Type"
              onChange={(e) => setMessage(e.target.value)}
              sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
            >
              <MenuItem value="" sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
                <em>None</em>
              </MenuItem>
              {MESSAGE_TYPES.map((type) => (
                <MenuItem 
                  key={type} 
                  value={type}
                  sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                >
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <FormControl fullWidth size="small">
            <InputLabel id="embark-label" sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
              Embarkation Ports
            </InputLabel>
            <Select
              labelId="embark-label"
              multiple
              value={embarkationLocations}
              onChange={(e) => setEmbarkationLocations(e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={value} 
                      size="small"
                      sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                    />
                  ))}
                </Box>
              )}
            >
              {allPorts.map((port) => (
                <MenuItem 
                  key={port} 
                  value={port}
                  sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                >
                  {port}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <FormControl fullWidth size="small">
            <InputLabel id="disembark-label" sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
              Disembarkation Ports
            </InputLabel>
            <Select
              labelId="disembark-label"
              multiple
              value={disembarkationLocations}
              onChange={(e) => setDisembarkationLocations(e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={value} 
                      size="small"
                      sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                    />
                  ))}
                </Box>
              )}
            >
              {allPorts.map((port) => (
                <MenuItem 
                  key={port} 
                  value={port}
                  sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                >
                  {port}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={2}>
          <FormControlLabel
            control={<Switch />}
            label="Is Transhipment"
            sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
          />
        </Grid>
        
        <Grid item xs={12} display="flex" justifyContent="flex-end" gap={1}>
          <Button 
            variant="outlined" 
            startIcon={<ClearIcon />}
            onClick={handleDoubleClick} // Agora usando a função de duplo clique
            sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
          >
            Clear
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={onApply}
            ref={applyButtonRef} // Adicionando a ref aqui
            sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
          >
            Apply Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}