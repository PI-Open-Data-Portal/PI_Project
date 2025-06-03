import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import {
  Card, 
  CardContent, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell,
  TableBody, 
  TablePagination, 
  TextField, 
  Grid, 
  Paper, 
  Typography, 
  Box,
  InputAdornment
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export default function DisembarkationChart({ data, error }) {
  const [filteredData, setFilteredData] = useState(data);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  
  // State for filter parameters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isTranshipment, setIsTranshipment] = useState(null);
  const [message, setMessage] = useState("");
  const [embarkationLocations, setEmbarkationLocations] = useState("");

  useEffect(() => {
    // Filter logic here using the data prop instead of fetching
    const filtered = data.filter(item =>
      item.disembarkationPort.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
    setPage(0);
  }, [data, search]);

return (

    <Card 
                elevation={3} 
                sx={{ 
                    marginBottom: 4
                }}
            >
    <Box sx={{ 
        backgroundColor: 'white', 
        minHeight: '100%', 
        padding: 3,
        fontFamily: "'Kdam Thmor Pro', sans-serif"
    }}>
        <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
                fontWeight: 600, 
                color: '#2c3e50', 
                marginBottom: 3,
                fontFamily: "'Kdam Thmor Pro', sans-serif"
            }}
        >
            Shipments by Disembarkation Port
        </Typography>

        <Paper 
            elevation={3} 
            sx={{ 
                marginBottom: 3, 
                padding: 2, 
                backgroundColor: 'white' 
            }}
        >
            <TextField
                fullWidth
                variant="outlined"
                label="Search by Disembarkation Port"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                    sx: {
                        borderRadius: 2,
                        fontFamily: "'Kdam Thmor Pro', sans-serif"
                    }
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        fontFamily: "'Kdam Thmor Pro', sans-serif",
                        '& fieldset': {
                            borderColor: '#457884',
                        },
                        '&:hover fieldset': {
                            borderColor: '#3a6d6d',
                        },
                    }
                }}
            />
        </Paper>

        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Card 
                    elevation={3} 
                    sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column' 
                    }}
                >
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                marginBottom: 2, 
                                color: '#2c3e50',
                                fontFamily: "'Kdam Thmor Pro', sans-serif"
                            }}
                        >
                            Port Details
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ 
                                        fontWeight: 'bold', 
                                        color: '#457884',
                                        fontFamily: "'Kdam Thmor Pro', sans-serif"
                                    }}>
                                        Disembarkation Port
                                    </TableCell>
                                    <TableCell sx={{ 
                                        fontWeight: 'bold', 
                                        color: '#457884',
                                        fontFamily: "'Kdam Thmor Pro', sans-serif"
                                    }}>
                                        Quantity
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((item) => (
                                        <TableRow 
                                            key={item.disembarkationPort}
                                            hover
                                        >
                                            <TableCell sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
                                                {item.disembarkationPort}
                                            </TableCell>
                                            <TableCell sx={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}>
                                                {item.count}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={filteredData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={(e, newPage) => setPage(newPage)}
                            onRowsPerPageChange={(e) => setRowsPerPage(+e.target.value)}
                            sx={{
                                '& .MuiTablePagination-toolbar': {
                                    color: '#457884',
                                    fontFamily: "'Kdam Thmor Pro', sans-serif"
                                }
                            }}
                        />
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card 
                    elevation={3} 
                    sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column' 
                    }}
                >
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                marginBottom: 2, 
                                color: '#2c3e50',
                                fontFamily: "'Kdam Thmor Pro', sans-serif"
                            }}
                        >
                            Shipment Distribution
                        </Typography>
                        <Box sx={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer>
                                <BarChart data={filteredData}>
                                    <CartesianGrid 
                                        strokeDasharray="3 3" 
                                        stroke="#e0e0e0" 
                                    />
                                    <XAxis 
                                        dataKey="disembarkationPort" 
                                        tick={{ 
                                            fontSize: 10,
                                            fontFamily: "'Kdam Thmor Pro', sans-serif"
                                        }} 
                                        angle={-45} 
                                        textAnchor="end" 
                                        stroke="#457884"
                                    />
                                    <YAxis 
                                        stroke="#457884" 
                                        label={{ 
                                            angle: -90, 
                                            position: 'insideLeft',
                                            fontFamily: "'Kdam Thmor Pro', sans-serif"
                                        }} 
                                    />
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} 
                                        contentStyle={{ 
                                            backgroundColor: 'white', 
                                            border: '1px solid #457884',
                                            fontFamily: "'Kdam Thmor Pro', sans-serif"
                                        }} 
                                    />
                                    <Bar 
                                        dataKey="count" 
                                        fill="#1976d2" 
                                        barSize={30} 
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </Box>
    </Card>
);
}