import { useState } from "react";
import {
  Paper,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Button,
  FormControlLabel,
  Switch
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function PortPairsFilters({ allPorts, onApplyFilters }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [message, setMessage] = useState("");
  const [embarkationLocations, setEmbarkationLocations] = useState([]);
  const [disembarkationLocations, setDisembarkationLocations] = useState([]);
  const [isTransshipment, setIsTransshipment] = useState(false);

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setMessage("");
    setEmbarkationLocations([]);
    setDisembarkationLocations([]);
    setIsTransshipment(false);
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      startDate,
      endDate,
      message,
      embarkationLocations,
      disembarkationLocations,
      isTransshipment
    });
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
          <TextField
            label="Message"
            fullWidth
            size="small"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
          />
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
            control={
              <Switch
                checked={isTransshipment}
                onChange={(e) => setIsTransshipment(e.target.checked)}
              />
            }
            label="Is Transhipment"
            sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
          />
        </Grid>
        
        <Grid item xs={12} display="flex" justifyContent="flex-end" gap={1}>
          <Button 
            variant="outlined" 
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
          >
            Clear
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={handleApplyFilters}
            sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
          >
            Apply Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
