import React from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';

const TableFilters = ({ 
  selectedProv2, 
  setSelectedProv2, 
  prov2Options, 
  containerPlateSearch, 
  setContainerPlateSearch,
  harmonizedCodeSearch,
  setHarmonizedCodeSearch,
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate, 
  handleFilterChange 
}) => {
  
  const handleProv2Change = (e) => {
    const newValue = e.target.value;
    setSelectedProv2(newValue);
    setTimeout(() => handleFilterChange(), 0);
  };
  
  const handleContainerPlateSearchChange = (e) => {
    const newValue = e.target.value;
    setContainerPlateSearch(newValue);
    setTimeout(() => handleFilterChange(), 0);
  };
  
  const handleHarmonizedCodeSearchChange = (e) => {
    const newValue = e.target.value;
    setHarmonizedCodeSearch(newValue);
    setTimeout(() => handleFilterChange(), 0);
  };
  
  const handleStartDateChange = (e) => {
    const newValue = e.target.value;
    setStartDate(newValue);
    setTimeout(() => handleFilterChange(), 0);
  };
  
  const handleEndDateChange = (e) => {
    const newValue = e.target.value;
    setEndDate(newValue);
    setTimeout(() => handleFilterChange(), 0);
  };
  
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel id="prov2-label">Prov2</InputLabel>
          <Select
            labelId="prov2-label"
            id="prov2-select"
            value={selectedProv2}
            label="Prov2"
            onChange={handleProv2Change}
          >
            <MenuItem value="">All</MenuItem>
            {prov2Options.map((prov) => (
              <MenuItem key={prov} value={prov}>{prov}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} sm={6} md={2.5}>
        <TextField
          fullWidth
          size="small"
          id="container-plate-search"
          label="Container Plate"
          variant="outlined"
          value={containerPlateSearch}
          onChange={handleContainerPlateSearchChange}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={2.5}>
        <TextField
          fullWidth
          size="small"
          id="harmonized-code-search"
          label="Harmonized Code"
          variant="outlined"
          value={harmonizedCodeSearch}
          onChange={handleHarmonizedCodeSearchChange}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={2.5}>
        <TextField
          fullWidth
          size="small"
          id="start-date"
          label="Start Date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={2.5}>
        <TextField
          fullWidth
          size="small"
          id="end-date"
          label="End Date"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </Grid>
  );
};

export default TableFilters;