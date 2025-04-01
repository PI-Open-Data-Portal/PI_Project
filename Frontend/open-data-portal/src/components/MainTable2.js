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
  Box
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
  const [filteredContainerDetails, setFilteredContainerDetails] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [containerNumberSearch, setContainerNumberSearch] = useState('');
  const [contentsSearch, setContentsSearch] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchContainerDetails(page, rowsPerPage);
  }, [page, rowsPerPage]);

  useEffect(() => {
    let filtered = [...containerDetails];

    if (containerNumberSearch) {
      filtered = filtered.filter(container => 
        container.id && 
        container.id.toLowerCase().includes(containerNumberSearch.toLowerCase())
      );
    }

    if (contentsSearch) {
      filtered = filtered.filter(container => 
        container.code && 
        container.code.toLowerCase().includes(contentsSearch.toLowerCase())
      );
    }

    if (startDate) {
      filtered = filtered.filter(container => 
        new Date(container.creationDate) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(container => 
        new Date(container.creationDate) <= new Date(endDate)
      );
    }

    setFilteredContainerDetails(filtered);
    setPage(0); 
  }, [containerDetails, containerNumberSearch, contentsSearch, startDate, endDate]);

  const fetchContainerDetails = async (page, size) => {
    try {
      const response = await axios.get('http://localhost:8080/apiV1/ContainerDetails', {
        params: { page, size:rowsPerPage, sort: 'id,ASC' },
      });
  
      if (response.data._embedded) {
  
        const data = response.data._embedded.containerDetailsList;
        console.log(data);
        setContainerDetails(data);
        setFilteredContainerDetails(data);
      } else {
        setContainerDetails([]);
        setFilteredContainerDetails([]);
      }
    } catch (error) {
      console.error('Error fetching container details:', error);
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
  };

  const handleContentsSearch = (event) => {
    setContentsSearch(event.target.value);
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
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
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
            {filteredContainerDetails
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
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
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredContainerDetails.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}




