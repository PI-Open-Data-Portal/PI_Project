import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import { 
  Button, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Grid, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Checkbox,
  FormControlLabel,
  Typography,
  Divider,
  Box,
  Alert,
  Snackbar
} from '@mui/material';

// All available columns/attributes
const allColumns = [
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'containerPlate', label: 'Container Plate', minWidth: 150 },
  { id: 'cargoDescription', label: 'Cargo Description', minWidth: 200 },
  { id: 'message', label: 'Message', minWidth: 150 },
  { id: 'movementDate', label: 'Movement Date', minWidth: 120 },
  { id: 'embarkationPort', label: 'Embarkation Port', minWidth: 150 },
  { id: 'disembarkationPort', label: 'Disembarkation Port', minWidth: 150 },
  { id: 'transhipment', label: 'Transhipment', minWidth: 120 },
  { id: 'isoContentainer', label: 'ISO Container', minWidth: 120 },
  { id: 'isoContentainerRegistry', label: 'ISO Container Registry', minWidth: 180 },
  { id: 'containerTare', label: 'Container Tare', minWidth: 120 },
  { id: 'containerState', label: 'Container State', minWidth: 120 },
  { id: 'harmonizedCode', label: 'Harmonized Code', minWidth: 150 },
  { id: 'weight', label: 'Weight (kg)', minWidth: 100, align: 'right', format: (value) => value?.toLocaleString() },
  { id: 'brokenPackagesQuantity', label: 'Broken Packages Qty', minWidth: 150 },
  { id: 'packagesQuantity', label: 'Packages Qty', minWidth: 120 },
  { id: 'departureWeight', label: 'Departure Weight', minWidth: 130 },
  { id: 'cn20078PLabelEN', label: 'CN Label', minWidth: 120 },
  { id: 'nst20073P', label: 'Code', minWidth: 100 },
  { id: 'nst20072P', label: 'NST 2P', minWidth: 100 },
  { id: 'prov', label: 'Prov', minWidth: 80 },
  { id: 'prov2', label: 'Prov2', minWidth: 80 },
];

// Default columns to display (max 7)
const defaultDisplayColumns = ['id', 'containerPlate', 'cargoDescription', 'nst20073P', 'prov2', 'weight'];

// Maximum number of columns allowed
const MAX_COLUMNS = 7;

export default function CaseStudyTable() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedProv2, setSelectedProv2] = useState('');
  const [prov2Options, setProv2Options] = useState([]);
  const [nst20073pSearch, setNst20073pSearch] = useState('');
  const [containerPlateSearch, setContainerPlateSearch] = useState('');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openColumnModal, setOpenColumnModal] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [displayColumns, setDisplayColumns] = useState(
    allColumns.filter(col => defaultDisplayColumns.includes(col.id))
  );
  const [columnSelections, setColumnSelections] = useState(
    allColumns.reduce((acc, col) => {
      acc[col.id] = defaultDisplayColumns.includes(col.id);
      return acc;
    }, {})
  );
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchCaseStudies();
  }, [page, rowsPerPage, selectedProv2, nst20073pSearch, containerPlateSearch]);

  const fetchCaseStudies = async () => {
    setLoading(true);
    try {
      // Build query parameters for filtering
      const params = {
        page: page,
        size: rowsPerPage,
        sort: 'id,ASC'
      };

      // Add filters if they exist
      if (selectedProv2) {
        params.prov2 = selectedProv2;
      }
      if (nst20073pSearch) {
        params.nst20073P = nst20073pSearch;
      }
      if (containerPlateSearch) {
        params.containerPlate = containerPlateSearch;
      }

      const response = await axios.get('http://localhost:8080/apiV1/casestudy', { params });
      
      if (response.data._embedded?.caseStudyList) {
        setCaseStudies(response.data._embedded.caseStudyList);
        // Extract total items from page metadata
        setTotalItems(response.data.page.totalElements);
      } else {
        setCaseStudies([]);
        setTotalItems(0);
      }

      // If prov2Options isn't initialized yet, set it
      if (prov2Options.length === 0) {
        setProv2Options(['T', 'ML', 'C']);
      }
    } catch (error) {
      console.error('Error fetching case studies:', error);
      setCaseStudies([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFilterChange = () => {
    setPage(0); // Reset to first page when filters change
  };

  const handleProv2Change = (e) => {
    setSelectedProv2(e.target.value);
    handleFilterChange();
  };

  const handleNst20073pSearchChange = (e) => {
    setNst20073pSearch(e.target.value);
    handleFilterChange();
  };

  const handleContainerPlateSearchChange = (e) => {
    setContainerPlateSearch(e.target.value);
    handleFilterChange();
  };

  const fetchCaseStudyDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/apiV1/casestudy/${id}`);
      setSelectedCaseStudy(response.data);
      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching case study details:', error);
    }
  };

  const handleOpenColumnModal = () => {
    setOpenColumnModal(true);
  };

  const handleCloseColumnModal = () => {
    setOpenColumnModal(false);
  };

  const countSelectedColumns = (selections) => {
    return Object.values(selections).filter(Boolean).length;
  };

  const handleColumnSelectionChange = (columnId) => {
    const newSelections = { ...columnSelections };
    
    // If trying to deselect ID column, prevent it
    if (columnId === 'id' && newSelections[columnId]) {
      showAlert('ID column cannot be deselected');
      return;
    }
    
    // If trying to select but already at max columns, prevent it
    if (!newSelections[columnId] && countSelectedColumns(newSelections) >= MAX_COLUMNS) {
      showAlert(`Maximum ${MAX_COLUMNS} columns allowed`);
      return;
    }
    
    // Toggle the selection
    newSelections[columnId] = !newSelections[columnId];
    setColumnSelections(newSelections);
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleSaveColumnSelections = () => {
    // Filter allColumns based on selections
    const selectedCount = countSelectedColumns(columnSelections);
    
    if (selectedCount > MAX_COLUMNS) {
      showAlert(`Please select a maximum of ${MAX_COLUMNS} columns`);
      return;
    }
    
    if (selectedCount === 0) {
      showAlert('Please select at least one column');
      return;
    }
    
    const newDisplayColumns = allColumns.filter(col => columnSelections[col.id]);
    setDisplayColumns(newDisplayColumns);
    handleCloseColumnModal();
  };

  const handleDeselectAllColumns = () => {
    const newSelections = {};
    allColumns.forEach(col => {
      newSelections[col.id] = false;
    });
    // Keep ID column selected as it's required
    newSelections['id'] = true;
    setColumnSelections(newSelections);
  };

  const handleResetToDefault = () => {
    const newSelections = {};
    allColumns.forEach(col => {
      newSelections[col.id] = defaultDisplayColumns.includes(col.id);
    });
    setColumnSelections(newSelections);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Filter by Prov2</InputLabel>
            <Select value={selectedProv2} onChange={handleProv2Change}>
              <MenuItem value="">All</MenuItem>
              {prov2Options.map((prov) => (
                <MenuItem key={prov} value={prov}>{prov}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField 
            fullWidth 
            label="Search by Container Plate" 
            value={containerPlateSearch} 
            onChange={handleContainerPlateSearchChange} 
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField 
            fullWidth 
            label="Search by Code" 
            value={nst20073pSearch} 
            onChange={handleNst20073pSearchChange} 
          />
        </Grid>
        <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            startIcon={<SettingsIcon />} 
            onClick={handleOpenColumnModal}
            sx={{ height: '56px' }}
            color='lightgrey'
          >
            Columns
          </Button>
        </Grid>
      </Grid>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {displayColumns.map((column) => (
                <TableCell 
                  key={column.id} 
                  align={column.align} 
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell style={{ minWidth: 50 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={displayColumns.length + 1} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : caseStudies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={displayColumns.length + 1} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              caseStudies.map((row) => (
                <TableRow hover key={row.id}>
                  {displayColumns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof row[column.id] === 'number'
                        ? column.format(row[column.id])
                        : row[column.id] || 'N/A'}
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton color="primary" onClick={() => fetchCaseStudyDetails(row.id)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Column Selection Modal */}
      <Dialog 
        open={openColumnModal} 
        onClose={handleCloseColumnModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Customize Table Columns</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Select up to {MAX_COLUMNS} columns to display
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" onClick={handleDeselectAllColumns} sx={{ mr: 1 }}>
              Deselect All
            </Button>
            <Button variant="outlined" onClick={handleResetToDefault}>
              Reset to Default
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Selected: {countSelectedColumns(columnSelections)}/{MAX_COLUMNS} columns
          </Typography>
          <Grid container spacing={2}>
            {allColumns.map((column) => (
              <Grid item xs={12} sm={6} md={4} key={column.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={columnSelections[column.id] || false}
                      onChange={() => handleColumnSelectionChange(column.id)}
                      // Always disable ID column since it's required
                      disabled={column.id === 'id'}
                    />
                  }
                  label={column.label}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseColumnModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveColumnSelections} color="primary" variant="contained">
            Apply Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Case Study Details Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Case Study Details</DialogTitle>
        <DialogContent>
          {selectedCaseStudy && <pre>{JSON.stringify(selectedCaseStudy, null, 2)}</pre>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="info" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}