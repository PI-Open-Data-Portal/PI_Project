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
  const [filteredCaseStudies, setFilteredCaseStudies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedProv2, setSelectedProv2] = useState('');
  const [prov2Options, setProv2Options] = useState([]);
  const [nst20073pSearch, setNst20073pSearch] = useState('');
  const [containerPlateSearch, setContainerPlateSearch] = useState('');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  useEffect(() => {
    let filtered = [...caseStudies];
    if (nst20073pSearch) {
      filtered = filtered.filter(study => study.nst20073P?.toLowerCase().includes(nst20073pSearch.toLowerCase()));
    }
    if (containerPlateSearch) {
      filtered = filtered.filter(study => study.containerPlate?.toLowerCase().includes(containerPlateSearch.toLowerCase()));
    }
    setFilteredCaseStudies(filtered);
    setPage(0);
  }, [caseStudies, nst20073pSearch, containerPlateSearch]);

  const fetchCaseStudies = async () => {
    try {
      const response = await axios.get('http://localhost:8080/apiV1/casestudy', {
        params: { page: 0, size: 2001, sort: 'id,ASC' },
      });
      if (response.data._embedded?.caseStudyList) {
        const data = response.data._embedded.caseStudyList;
        setCaseStudies(data);
        setFilteredCaseStudies(data);
        setProv2Options(['T', 'ML', 'C']);
      }
    } catch (error) {
      console.error('Error fetching case studies:', error);
    }
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
            <Select value={selectedProv2} onChange={(e) => setSelectedProv2(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {prov2Options.map((prov) => (
                <MenuItem key={prov} value={prov}>{prov}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4.5}>
          <TextField fullWidth label="Search by Container Plate" value={containerPlateSearch} onChange={(e) => setContainerPlateSearch(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={4.5}>
          <TextField fullWidth label="Search by Code" value={nst20073pSearch} onChange={(e) => setNst20073pSearch(e.target.value)} />
        </Grid>
      </Grid>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>{column.label}</TableCell>
              ))}
              <TableCell>
                
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCaseStudies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>{row[column.id] || 'N/A'}</TableCell>
                ))}
                <TableCell>
                  <IconButton color="primary" onClick={() => fetchCaseStudyDetails(row.id)}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredCaseStudies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(+e.target.value)}
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
