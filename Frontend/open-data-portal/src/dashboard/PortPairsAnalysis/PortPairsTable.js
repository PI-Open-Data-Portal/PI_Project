// PortPairsTable.jsx
import React from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination
} from "@mui/material";

export default function PortPairsTable({ 
  filteredPortPairsData, 
  page, 
  setPage, 
  rowsPerPage, 
  setRowsPerPage 
}) {
  return (
    <TableContainer 
      component={Paper}
      sx={{ 
        maxHeight: 500,
        fontFamily: "'Kdam Thmor Pro', sans-serif"
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ 
              fontWeight: 'bold',
              fontFamily: "'Kdam Thmor Pro', sans-serif",
              backgroundColor: '#457884',
              color: 'white'
            }}>
              Embarkation Port
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 'bold',
              fontFamily: "'Kdam Thmor Pro', sans-serif",
              backgroundColor: '#457884',
              color: 'white'
            }}>
              Disembarkation Port
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 'bold',
              fontFamily: "'Kdam Thmor Pro', sans-serif",
              backgroundColor: '#457884',
              color: 'white'
            }}>
              Count
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPortPairsData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item, index) => (
              <TableRow 
                key={`${item.embarkationPort}-${item.disembarkationPort}`}
                hover
                sx={{ 
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white'
                }}
              >
                <TableCell sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
                  {item.embarkationPort}
                </TableCell>
                <TableCell sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
                  {item.disembarkationPort}
                </TableCell>
                <TableCell sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
                  {item.count.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          {filteredPortPairsData.length === 0 && (
            <TableRow>
              <TableCell 
                colSpan={3} 
                align="center"
                sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
              >
                No data available. Try adjusting your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredPortPairsData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        sx={{
          fontFamily: "'Kdam Thmor Pro', sans-serif"
        }}
      />
    </TableContainer>
  );
}