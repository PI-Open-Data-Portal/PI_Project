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
import { 
  TextField,
  Grid,
  Box,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const columns = [
  { id: 'id', label: 'ID', minWidth: 80 },
  { id: 'code', label: 'Code', minWidth: 150 },
  { id: 'creationDate', label: 'Creation Date', minWidth: 100 }
];

export default function MainTable2() {
  const [containerDetails, setContainerDetails] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [containerNumberSearch, setContainerNumberSearch] = useState('');
  const [contentsSearch, setContentsSearch] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch data whenever page, rowsPerPage, or any filter changes
  useEffect(() => {
    fetchContainerDetails();
  }, [page, rowsPerPage, containerNumberSearch, contentsSearch, startDate, endDate]);

  const fetchContainerDetails = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = {
        page: page,
        size: rowsPerPage,
        sort: 'id,ASC'
      };

      // Add filters if they exist
      if (containerNumberSearch) {
        params.id = containerNumberSearch;
      }
      if (contentsSearch) {
        params.code = contentsSearch;
      }
      if (startDate) {
        params.startDate = startDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      }
      if (endDate) {
        params.endDate = endDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      }

      const response = await axios.get('http://localhost:8080/apiV1/ContainerDetails', { params });
  
      if (response.data._embedded?.containerDetailsList) {
        setContainerDetails(response.data._embedded.containerDetailsList);
        // Extract total items from page metadata if available
        setTotalItems(response.data.page?.totalElements || response.data._embedded.containerDetailsList.length);
      } else {
        setContainerDetails([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Error fetching container details:', error);
      setContainerDetails([]);
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

  const handleContainerNumberSearch = (event) => {
    setContainerNumberSearch(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  const handleContentsSearch = (event) => {
    setContentsSearch(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    setPage(0); // Reset to first page when filter changes
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
    setPage(0); // Reset to first page when filter changes
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search by ID"
            variant="outlined"
            value={containerNumberSearch}
            onChange={handleContainerNumberSearch}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search by Code"
            variant="outlined"
            value={contentsSearch}
            onChange={handleContentsSearch}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box display="flex" justifyContent="space-between">
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={handleStartDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={handleEndDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
          </LocalizationProvider>
        </Grid>
      </Grid>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="container details table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography>Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : containerDetails.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography>No data found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              containerDetails.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id]; 
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'creationDate' 
                          ? new Date(value).toLocaleDateString('en-GB') 
                          : value !== null && value !== undefined ? value : 'N/A'}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}