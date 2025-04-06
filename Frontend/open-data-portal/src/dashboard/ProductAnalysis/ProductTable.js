import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Box
} from "@mui/material";

const ProductTable = ({ data, colors }) => {
  // Calculate total count for percentage calculations
  const totalProductCount = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        marginTop: 2,
        maxHeight: 300,
        fontFamily: "'Kdam Thmor Pro', sans-serif" 
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell 
              sx={{ 
                fontFamily: "'Kdam Thmor Pro', sans-serif",
                fontWeight: 'bold',
                backgroundColor: '#457884',
                color: 'white'
              }}
            >
              Product Category
            </TableCell>
            <TableCell 
              align="right" 
              sx={{ 
                fontFamily: "'Kdam Thmor Pro', sans-serif",
                fontWeight: 'bold',
                backgroundColor: '#457884',
                color: 'white'
              }}
            >
              Count
            </TableCell>
            <TableCell 
              align="right" 
              sx={{ 
                fontFamily: "'Kdam Thmor Pro', sans-serif",
                fontWeight: 'bold',
                backgroundColor: '#457884',
                color: 'white'
              }}
            >
              Percentage
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => {
            const percentage = ((item.count / totalProductCount) * 100).toFixed(2);
            
            return (
              <TableRow 
                key={item.nst2007_2P}
                hover
                sx={{ 
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white'
                }}
              >
                <TableCell 
                  component="th" 
                  scope="row"
                  sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box 
                      sx={{
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        backgroundColor: colors[index % colors.length],
                      }} 
                    />
                    {item.nst2007_2PLabelEN}
                  </Box>
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                >
                  {item.count.toLocaleString()}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                >
                  {percentage}%
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
