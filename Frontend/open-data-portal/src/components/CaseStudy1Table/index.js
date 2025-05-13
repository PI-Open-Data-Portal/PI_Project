import React, { useState, useEffect } from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Snackbar,
  Alert,
  Box,
  Tooltip,
  IconButton,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

// Import components
import TableFilters from './TableFilters';
import TableActions from './TableActions';
import ColumnSelectionModal from './ColumnSelectionModal';
import CaseStudyDetailsModal from './CaseStudyDetailsModal';
import CodeDetailsModal from './CodeDetailsModal';
import DownloadData from './DownloadData';
import axios from 'axios';
// Import constants
import { allColumns, defaultDisplayColumns, MAX_COLUMNS } from '../../utils/constants';

// Define error types for the report modal
const ERROR_TYPES = [
  { value: 'data_inconsistency', label: 'Inconsistency data' },
  { value: 'missing_information', label: 'Missing Value' },
  { value: 'incorrect_values', label: 'Invalid Format' },
  { value: 'duplicate_entry', label: 'Numerical Error' },
  { value: 'other', label: 'Other' },
];

export default function CaseStudyTable() {
  // State for data
  const [caseStudies, setCaseStudies] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // State for filters
  const [selectedProv2, setSelectedProv2] = useState('');
  const [prov2Options, setProv2Options] = useState([]);
  const [nst20073pSearch, setNst20073pSearch] = useState('');
  const [containerPlateSearch, setContainerPlateSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // State for modals
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openColumnModal, setOpenColumnModal] = useState(false);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  
  // State for Report Data modal
  const [openReportModal, setOpenReportModal] = useState(false);
  const [errorType, setErrorType] = useState('');
  const [errorDescription, setErrorDescription] = useState('');

  // State for column display
  const [displayColumns, setDisplayColumns] = useState(
    allColumns.filter((col) => defaultDisplayColumns.includes(col.id))
  );
  const [columnSelections, setColumnSelections] = useState(
    allColumns.reduce((acc, col) => {
      acc[col.id] = defaultDisplayColumns.includes(col.id);
      return acc;
    }, {})
  );

  // State for alerts
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // State for row selection
  const [selected, setSelected] = useState([]);

  // Effects
  useEffect(() => {
    fetchCaseStudies();
  }, [page, rowsPerPage, selectedProv2, nst20073pSearch, containerPlateSearch, startDate, endDate]);

  // API calls
  const fetchCaseStudies = async () => {
    setLoading(true);
    try {
      const params = {
        page: page,
        size: rowsPerPage,
        sort: 'id,ASC',
      };

      if (selectedProv2) params.prov2 = selectedProv2;
      if (nst20073pSearch) params.nst20073P = nst20073pSearch;
      if (containerPlateSearch) params.containerPlate = containerPlateSearch;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      console.log('Sending API request with params:', params);
      const response = await axios.get('http://localhost:8080/apiV1/casestudy', { params });

      if (response.data._embedded?.caseStudyList) {
        setCaseStudies(response.data._embedded.caseStudyList);
        setTotalItems(response.data.page.totalElements);
      } else {
        setCaseStudies([]);
        setTotalItems(0);
      }

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

  // Handlers
  const handleOpenColumnModal = () => setOpenColumnModal(true);
  const handleCloseColumnModal = () => setOpenColumnModal(false);

  const handleOpenModal = (caseStudy) => {
    setSelectedCaseStudy(caseStudy);
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    setSelected([]);
  };
  
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
  };

  const handleSaveColumnSelections = () => {
    const selectedColumns = allColumns.filter((col) => columnSelections[col.id]);
    setDisplayColumns(selectedColumns);
    handleCloseColumnModal();
  };

  const handleDeselectAllColumns = () => {
    setColumnSelections({});
  };

  const handleResetToDefault = () => {
    setColumnSelections(
      allColumns.reduce((acc, col) => {
        acc[col.id] = defaultDisplayColumns.includes(col.id);
        return acc;
      }, {})
    );
  };

  const handleFilterChange = () => {
    setPage(0); 
    setSelected([]);
  };

  const handleCloseAlert = () => setAlertOpen(false);
  
  // Row selection handlers
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = caseStudies.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((itemId) => itemId !== id);
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;
  
  // Report Data handlers
  const handleOpenReportModal = () => {
    if (selected.length === 0) return;
    setOpenReportModal(true);
  };

  const handleCloseReportModal = () => {
    setOpenReportModal(false);
    setErrorType('');
    setErrorDescription('');
  };

  const handleSubmitReport = () => {
    if (!errorType) {
      setAlertMessage('Por favor, selecione um tipo de erro');
      setAlertOpen(true);
      return;
    }

    if (!errorDescription.trim()) {
      setAlertMessage('Por favor, forneça uma descrição do erro');
      setAlertOpen(true);
      return;
    }

    // Here you would implement the logic to submit the report
    console.log("Reporting error:", {
      itemIds: selected,
      errorType: errorType,
      description: errorDescription
    });
    
    setAlertMessage(`Error report submitted`);
    setAlertOpen(true);
    
    // Reset after submitting
    handleCloseReportModal();
    // Uncomment below if you want to clear selection after submitting
    // setSelected([]);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
      {/* Filters */}
      <TableFilters
        selectedProv2={selectedProv2}
        setSelectedProv2={setSelectedProv2}
        prov2Options={prov2Options}
        containerPlateSearch={containerPlateSearch}
        setContainerPlateSearch={setContainerPlateSearch}
        nst20073pSearch={nst20073pSearch}
        setNst20073pSearch={setNst20073pSearch}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        handleFilterChange={handleFilterChange}
      />
      <DownloadData
        open={openDownloadModal}
        onClose={() => setOpenDownloadModal(false)}
        allColumns={allColumns}
        defaultSelectedColumns={defaultDisplayColumns}
        onDownload={(selectedColumns, format, setIsDownloading) => {
          // Your download logic here
          console.log("Downloading columns:", selectedColumns, "in format:", format);
          // After download completes:
          setIsDownloading(false);
        }}
      />

      {/* Table Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TableActions
          handleOpenColumnModal={handleOpenColumnModal}
          handleDownload={() => setOpenDownloadModal(true)}
        />
        
        {/* Report Data Button */}
        <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
          <Button 
            variant="outlined" 
            color="warning" 
            startIcon={<ReportProblemIcon />} 
            onClick={handleOpenReportModal}
            disabled={selected.length === 0}
            size="small"
            sx={{ height: '56px' }}
          >
            Report Data ({selected.length})
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selected.length > 0 && selected.length < caseStudies.length}
                  checked={caseStudies.length > 0 && selected.length === caseStudies.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              {displayColumns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
              <TableCell align="right" sx={{ width: 100 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={displayColumns.length + 2} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : caseStudies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={displayColumns.length + 2} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              caseStudies.map((row) => {
                const isItemSelected = isSelected(row.id);
                return (
                  <TableRow
                    key={row.id}
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    selected={isItemSelected}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onClick={(event) => handleSelectClick(event, row.id)}
                      />
                    </TableCell>
                    {displayColumns.map((column) => (
                      <TableCell key={column.id}>
                        {row[column.id]}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="View details">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal(row);
                            }}
                            sx={{ color: '#457985' }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Prov graph">
                          <IconButton
                            href={`/provGraph?prov=${row.prov}`}
                            size="small"
                            onClick={(e) => e.stopPropagation()}
                            sx={{ color: '#457985' }}
                          >
                            <LocationOnIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Modals */}
      <ColumnSelectionModal
        open={openColumnModal}
        handleClose={handleCloseColumnModal}
        allColumns={allColumns}
        columnSelections={columnSelections}
        handleColumnSelectionChange={(columnId) =>
          setColumnSelections((prev) => ({
            ...prev,
            [columnId]: !prev[columnId],
          }))
        }
        handleDeselectAllColumns={handleDeselectAllColumns}
        handleResetToDefault={handleResetToDefault}
        handleSaveColumnSelections={handleSaveColumnSelections}
        countSelectedColumns={(selections) =>
          Object.values(selections).filter(Boolean).length
        }
        maxColumns={MAX_COLUMNS}
      />

      <CaseStudyDetailsModal
        open={openModal}
        handleClose={handleCloseModal}
        selectedCaseStudy={selectedCaseStudy}
      />

      {/* Report Data Modal */}
      <Dialog open={openReportModal} onClose={handleCloseReportModal} maxWidth="sm" fullWidth>
        <DialogTitle>Report Data Issue</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="error-type-label">Error Type</InputLabel>
              <Select
                labelId="error-type-label"
                id="error-type"
                value={errorType}
                label="Error Type"
                onChange={(e) => setErrorType(e.target.value)}
              >
                {ERROR_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              autoFocus
              margin="normal"
              id="error-description"
              label="Error Description"
              fullWidth
              multiline
              rows={4}
              value={errorDescription}
              onChange={(e) => setErrorDescription(e.target.value)}
            />
            
            <Box sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
              {selected.length} case(s) selected for reporting
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReportModal}>Cancel</Button>
          <Button onClick={handleSubmitReport} variant="contained" color="primary">
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>

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