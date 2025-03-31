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
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const columns = [
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'containerPlate', label: 'Container Plate', minWidth: 150 },
  { id: 'cargoDescription', label: 'Cargo Description', minWidth: 200 },
  { id: 'nst20073P', label: 'Code', minWidth: 100 },
  { id: 'prov2', label: 'Prov2', minWidth: 100 },
  { id: 'weight', label: 'Weight (kg)', minWidth: 100, align: 'right', format: (value) => value.toLocaleString() },
];

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
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

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
        <Grid item xs={12} md={4.5}>
          <TextField 
            fullWidth 
            label="Search by Container Plate" 
            value={containerPlateSearch} 
            onChange={handleContainerPlateSearchChange} 
          />
        </Grid>
        <Grid item xs={12} md={4.5}>
          <TextField 
            fullWidth 
            label="Search by Code" 
            value={nst20073pSearch} 
            onChange={handleNst20073pSearchChange} 
          />
        </Grid>
      </Grid>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : caseStudies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              caseStudies.map((row) => (
                <TableRow hover key={row.id}>
                  {columns.map((column) => (
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
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Case Study Details</DialogTitle>
        <DialogContent>
          {selectedCaseStudy && <pre>{JSON.stringify(selectedCaseStudy, null, 2)}</pre>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}