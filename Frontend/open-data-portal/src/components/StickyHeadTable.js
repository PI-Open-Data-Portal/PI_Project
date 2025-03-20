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
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const columns = [
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'containerPlate', label: 'Container Plate', minWidth: 150 },
  { id: 'cargoDescription', label: 'Cargo Description', minWidth: 200 },
  { id: 'harmonizedCode', label: 'Harmonized Code', minWidth: 100 },
  { id: 'prov2', label: 'Prov2', minWidth: 100 },
  { id: 'weight', label: 'Weight (kg)', minWidth: 100, align: 'right', format: (value) => value.toLocaleString() },
];

export default function CaseStudyTable() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProv2, setSelectedProv2] = useState('');
  const [prov2Options, setProv2Options] = useState([]);

  useEffect(() => {
    fetchCaseStudies(page, rowsPerPage, selectedProv2);
  }, [page, rowsPerPage, selectedProv2]);

  const fetchCaseStudies = async (page, size, prov2) => {
    try {
      let response;
      if (prov2) {
        response = await axios.get(`http://localhost:8080/apiV1/casestudy/prov/${prov2}`, {
          params: { page, size, sort: 'id,ASC' },
        });
      } else {
        response = await axios.get('http://localhost:8080/apiV1/casestudy', {
          params: { page, size, sort: 'id,ASC' },
        });
      }

      if (response.data._embedded?.caseStudyList) {
        const data = response.data._embedded.caseStudyList;
        setCaseStudies(data);

        if (!prov2) {
          setProv2Options(['T', 'ML', 'C']);
        }
      } else {
        setCaseStudies([]);
        setProv2Options([]);
      }
    } catch (error) {
      console.error('Erro ao buscar case studies:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setSelectedProv2(event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
      <FormControl sx={{ minWidth: 200, marginBottom: 2 }}>
        <InputLabel>Filter by Prov2</InputLabel>
        <Select value={selectedProv2} onChange={handleFilterChange} displayEmpty>
          <MenuItem value="">All</MenuItem>
          {prov2Options.map((prov) => (
            <MenuItem key={prov} value={prov}>{prov}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="case study table">
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
            {caseStudies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === 'number' ? column.format(value) : value !== null && value !== undefined ? value : 'N/A'}
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
        count={caseStudies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
