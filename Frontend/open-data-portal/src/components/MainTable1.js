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
import InfoIcon from '@mui/icons-material/Info';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import ScaleIcon from '@mui/icons-material/Scale';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Chip } from '@mui/material';
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
  Snackbar,
  Tooltip,
  Stack
} from '@mui/material';

// All available columns/attributes with added descriptions
const allColumns = [
  { id: 'id', label: 'ID', minWidth: 50, description: 'Unique identifier for the case study' },
  { id: 'containerPlate', label: 'Container Plate', minWidth: 150, description: 'Identification plate of the container' },
  { id: 'cargoDescription', label: 'Cargo Description', minWidth: 200, description: 'Description of the cargo contents' },
  { id: 'message', label: 'Message', minWidth: 150, description: 'Associated message information' },
  { id: 'movementDate', label: 'Movement Date', minWidth: 120, description: 'Date when the container was moved' },
  { id: 'embarkationPort', label: 'Embarkation Port', minWidth: 150, description: 'Port where cargo was loaded' },
  { id: 'disembarkationPort', label: 'Disembarkation Port', minWidth: 150, description: 'Port where cargo will be unloaded' },
  { id: 'transhipment', label: 'Transhipment', minWidth: 120, description: 'Transfer of cargo from one vessel to another' },
  { id: 'isoContentainer', label: 'ISO Container', minWidth: 120, description: 'ISO standard container information' },
  { id: 'isoContentainerRegistry', label: 'ISO Container Registry', minWidth: 180, description: 'Registry information for the ISO container' },
  { id: 'containerTare', label: 'Container Tare', minWidth: 120, description: 'Weight of the empty container' },
  { id: 'containerState', label: 'Container State', minWidth: 120, description: 'State of the container' },
  { id: 'harmonizedCode', label: 'Harmonized Code', minWidth: 150, description: '8-digit identifier', isCode: true, codeType: '8-digit', hasLabel: 'cn20078PLabelEN' },
  { id: 'weight', label: 'Weight (kg)', minWidth: 100, align: 'right', format: (value) => value?.toLocaleString(), description: 'Weight of cargo in kilograms' },
  { id: 'brokenPackagesQuantity', label: 'Broken Packages Qty', minWidth: 150, description: 'Quantity of damaged packages' },
  { id: 'packagesQuantity', label: 'Packages Qty', minWidth: 120, description: 'Total quantity of packages' },
  { id: 'departureWeight', label: 'Departure Weight', minWidth: 130, description: 'Weight at departure' },
  { id: 'nst20073P', label: 'NST 3P', minWidth: 100, description: '3-digit identifier', isCode: true, codeType: '3-digit', hasLabel: 'nst20073PLabelEN' },
  { id: 'nst20072P', label: 'NST 2P', minWidth: 100, description: '2-digit identifier', isCode: true, codeType: '2-digit', hasLabel: 'nst20072PLabelEN' },
  { id: 'prov2', label: 'Prov2', minWidth: 80, description: 'Data prov information' },
];

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
  
  // New state for code details modal
  const [codeDetailsOpen, setCodeDetailsOpen] = useState(false);
  const [selectedCodeDetails, setSelectedCodeDetails] = useState(null);
  const [codeModalTitle, setCodeModalTitle] = useState('');

  


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


  // New function to handle code click and show the modal with appropriate details
  const handleCodeClick = (row, columnId) => {
    const column = allColumns.find(col => col.id === columnId);
    if (!column || !column.isCode) return;
    
    let details = {};
    let title = '';
    
    // Set data based on code type
    if (column.codeType === '2-digit') {
      // For 2-digit codes: Show only its description
      title = `${column.label} Code Details`;
      details = {
        code: row[columnId],
        description: row[column.hasLabel] || 'No description available'
      };
    } 
    else if (column.codeType === '3-digit') {
      // For 3-digit codes: Show its description + 2-digit code and description
      title = `${column.label} Code Details`;
      details = {
        code: row[columnId],
        description: row[column.hasLabel] || 'No description available',
        relatedCode: {
          code: row['nst20072P'],
          label: '2-digit Code (NST 2P)',
          description: row['nst20072PLabelEN'] || 'No description available'
        }
      };
    } 
    else if (column.codeType === '8-digit') {
      // For 8-digit codes: Show its description + 3-digit code/description + 2-digit code/description
      title = `${column.label} Details`;
      details = {
        code: row[columnId],
        description: row[column.hasLabel] || 'No description available',
        relatedCodes: [
          {
            code: row['nst20073P'],
            label: '3-digit Code (NST 3P)',
            description: row['nst20073PLabelEN'] || 'No description available'
          },
          {
            code: row['nst20072P'],
            label: '2-digit Code (NST 2P)',
            description: row['nst20072PLabelEN'] || 'No description available'
          }
        ]
      };
    }
    
    setSelectedCodeDetails(details);
    setCodeModalTitle(title);
    setCodeDetailsOpen(true);
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
            sx={{ 
              height: '56px',
              color: '#457985',     // Text color
              borderColor: '#457985', // Border color
              '&:hover': {
                borderColor: '#457985',
                backgroundColor: 'rgba(69, 121, 133, 0.04)', // Lighter version for hover
              }
            }}
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
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {column.label}
                    <Tooltip title={column.description || "No description available"} arrow>
                      <IconButton size="small" sx={{ ml: 0.5 }}>
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              ))}
              <TableCell style={{ minWidth: 100 }}>Actions</TableCell>
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
                  {displayColumns.map((column) => {
                    const isCodeColumn = column.isCode;
                    
                    return (
                      <TableCell 
                        key={column.id} 
                        align={column.align}
                      >
                        {isCodeColumn ? (
                          <Box 
                            onClick={() => handleCodeClick(row, column.id)}
                            sx={{ 
                              display: 'inline-flex', 
                              alignItems: 'center',
                              cursor: 'pointer',
                              color: '#457985',
                              '&:hover': {
                                color: '#457985',
                                fontWeight: 'medium'
                              }
                            }}
                          >
                            {column.format && typeof row[column.id] === 'number'
                              ? column.format(row[column.id])
                              : row[column.id] || 'N/A'}
                          </Box>
                        ) : (
                          column.format && typeof row[column.id] === 'number'
                            ? column.format(row[column.id])
                            : row[column.id] || 'N/A'
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View details">
                        <IconButton 
                          size="small" 
                          onClick={() => fetchCaseStudyDetails(row.id)}
                          sx={{ color: '#457985' }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Prov graph">
                        <IconButton 
                          href='/provGraph'
                          size="small" 
                          sx={{ color: '#457985' }}
                        >
                          <LocationOnIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
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
<Dialog 
  open={openModal} 
  onClose={() => setOpenModal(false)} 
  maxWidth="md" 
  fullWidth
  PaperProps={{
    elevation: 3,
    sx: { borderRadius: 2 }
  }}
>
  <DialogTitle sx={{ bgcolor: '#457985', color: 'white', display: 'flex', alignItems: 'center' }}>
    <LocalShippingIcon sx={{ mr: 1 }} />
    <Typography variant="h6">
      Cargo Container Details - {selectedCaseStudy?.containerPlate || 'Loading...'}
    </Typography>
  </DialogTitle>
  
  <DialogContent dividers>
    {!selectedCaseStudy ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading case study details...</Typography>
      </Box>
    ) : (
      <Grid container spacing={3}>
        {/* Container Information Section */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#457985', fontWeight: 'bold' }}>
              <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Container Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Container ID</Typography>
                <Typography variant="body1">{selectedCaseStudy.id || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Container Plate</Typography>
                <Typography variant="body1">{selectedCaseStudy.containerPlate || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">State</Typography>
                <Chip 
                  label={selectedCaseStudy.containerState || 'Unknown'} 
                  color={selectedCaseStudy.containerState === "Active" ? "success" : "default"}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">ISO Container</Typography>
                <Typography variant="body1">{selectedCaseStudy.isoContentainer || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">ISO Registry</Typography>
                <Typography variant="body1">{selectedCaseStudy.isoContentainerRegistry || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Container Tare</Typography>
                <Typography variant="body1">{selectedCaseStudy.containerTare || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Cargo Information Section */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#457985', fontWeight: 'bold' }}>
              <ScaleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Cargo Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Cargo Description</Typography>
                <Typography variant="body1">{selectedCaseStudy.cargoDescription || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Weight (kg)</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedCaseStudy.weight?.toLocaleString() || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Departure Weight</Typography>
                <Typography variant="body1">
                  {selectedCaseStudy.departureWeight?.toLocaleString() || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Packages Quantity</Typography>
                <Typography variant="body1">{selectedCaseStudy.packagesQuantity || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Broken Packages</Typography>
                <Typography variant="body1">{selectedCaseStudy.brokenPackagesQuantity || '0'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Harmonized Code</Typography>
                <Typography variant="body1" color="#457985" sx={{ fontFamily: 'monospace' }}>
                  {selectedCaseStudy.harmonizedCode || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Shipping Information Section */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#457985', fontWeight: 'bold' }}>
              <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Shipping Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Movement Date</Typography>
                <Typography variant="body1">
                  <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                  {selectedCaseStudy.movementDate || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Embarkation Port</Typography>
                <Typography variant="body1">{selectedCaseStudy.embarkationPort || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Disembarkation Port</Typography>
                <Typography variant="body1">{selectedCaseStudy.disembarkationPort || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Transhipment</Typography>
                <Typography variant="body1">{selectedCaseStudy.transhipment || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Classification Codes Section */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#457985', fontWeight: 'bold' }}>
              Classification Codes
            </Typography>
            
            <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
  <Box sx={{ border: '1px solid #ddd', p: 1.5, borderRadius: 1, bgcolor: 'white', height: '100%' }}>
    <Typography variant="subtitle2" color="text.secondary">NST 2P</Typography>
    <Typography variant="h6" color="#457985" sx={{ fontFamily: 'monospace' }}>
      {selectedCaseStudy.nst20072P || 'N/A'}
    </Typography>
    <Typography variant="body2">
      {selectedCaseStudy.nst20072PLabelEN || 'No description'}
    </Typography>
  </Box>
</Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ border: '1px solid #ddd', p: 1.5, borderRadius: 1, bgcolor: 'white' }}>
                  <Typography variant="subtitle2" color="text.secondary">NST 3P</Typography>
                  <Typography variant="h6" color="#457985" sx={{ fontFamily: 'monospace' }}>
                    {selectedCaseStudy.nst20073P || 'N/A'}
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {selectedCaseStudy.nst20073PLabelEN || 'No description'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ border: '1px solid #ddd', p: 1.5, borderRadius: 1, bgcolor: 'white' }}>
                  <Typography variant="subtitle2" color="text.secondary">Data Prov</Typography>
                  <Typography variant="h6" color="#457985" sx={{ fontFamily: 'monospace' }}>
                    {selectedCaseStudy.prov2 || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    )}
  </DialogContent>
  
  <DialogActions sx={{ p: 2 }}>
    <Button 
      variant="outlined" 
      color="primary" 
      onClick={() => setOpenModal(false)}
    >
      Close Details
    </Button>
  </DialogActions>
</Dialog>

      {/* Code Details Modal */}
      <Dialog 
        open={codeDetailsOpen} 
        onClose={() => setCodeDetailsOpen(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>{codeModalTitle}</DialogTitle>
        <DialogContent>
          {selectedCodeDetails && (
            <Box sx={{ mt: 1 }}>
              {/* Main code info */}
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {selectedCodeDetails.code}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedCodeDetails.description}
              </Typography>
              
              {/* Single related code (for 3-digit) */}
              {selectedCodeDetails.relatedCode && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {selectedCodeDetails.relatedCode.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    {selectedCodeDetails.relatedCode.code}
                  </Typography>
                  <Typography variant="body1">
                    {selectedCodeDetails.relatedCode.description}
                  </Typography>
                </>
              )}
              
              {/* Multiple related codes (for 8-digit) */}
              {selectedCodeDetails.relatedCodes && selectedCodeDetails.relatedCodes.map((relatedCode, index) => (
                <React.Fragment key={index}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {relatedCode.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    {relatedCode.code}
                  </Typography>
                  <Typography variant="body1">
                    {relatedCode.description}
                  </Typography>
                </React.Fragment>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCodeDetailsOpen(false)} color="primary">Close</Button>
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