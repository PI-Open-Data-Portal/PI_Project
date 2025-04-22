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
  nst20073pSearch, 
  setNst20073pSearch,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleFilterChange 
}) => {
  
  // Update these handlers to ensure they properly update state
  const handleProv2Change = (e) => {
    const newValue = e.target.value;
    setSelectedProv2(newValue);
    // Ensure handleFilterChange runs after state update
    setTimeout(() => handleFilterChange(), 0);
  };

  const handleContainerPlateSearchChange = (e) => {
    const newValue = e.target.value;
    setContainerPlateSearch(newValue);
    setTimeout(() => handleFilterChange(), 0);
  };

  const handleNst20073pSearchChange = (e) => {
    const newValue = e.target.value;
    setNst20073pSearch(newValue);
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
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} md={2}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Filter by Prov2</InputLabel>
          <Select 
            value={selectedProv2} 
            onChange={handleProv2Change}
            label="Filter by Prov2" // Adding label for outlined variant
          >
            <MenuItem value="">All</MenuItem>
            {prov2Options.map((prov) => (
              <MenuItem key={prov} value={prov}>{prov}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={2.5}>
        <TextField
          fullWidth
          label="Search by Container Plate"
          value={containerPlateSearch}
          onChange={handleContainerPlateSearchChange}
        />
      </Grid>
      <Grid item xs={12} md={2.5}>
        <TextField
          fullWidth
          label="Search by Code"
          value={nst20073pSearch}
          onChange={handleNst20073pSearchChange}
        />
      </Grid>
      <Grid item xs={12} md={2.5}>
        <TextField
          fullWidth
          label="Start Date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="mm/dd/yyyy"
        />
      </Grid>
      <Grid item xs={12} md={2.5}>
        <TextField
          fullWidth
          label="End Date"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="mm/dd/yyyy"
        />
      </Grid>
    </Grid>
  );
};

export default TableFilters;