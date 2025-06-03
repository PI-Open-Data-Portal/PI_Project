import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Box,
    Tooltip,
    Chip,
    IconButton,
    FormControlLabel,
    Switch,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import VisibilityIcon from '@mui/icons-material/Visibility';

const API_BASE_URL = 'http://localhost:8080/api/shipdata';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleString();
    } catch (e) {
        return dateString; // Fallback if date is invalid
    }
};

// Renders value with previous, current, and suggested (if different from current)
const renderChangeValue = (currentInDB, suggestedBySystem, unit = '') => {
    const valToString = (val, u) => {
        if (val === null || val === undefined || val.toString().trim() === '') return 'N/A';
        return `${val}${u}`; // Appends unit directly, e.g., 10m, 15 knots
    };

    const currentDBStr = valToString(currentInDB, unit);
    const suggestedSystemStr = valToString(suggestedBySystem, unit);

    const showSuggestion = suggestedSystemStr !== 'N/A' && suggestedSystemStr !== currentDBStr;

    return (
        <Box display="flex" alignItems="center" flexWrap="wrap" sx={{ minHeight: '30px' }}>
            {showSuggestion ? (
                <>
                    <Tooltip title="Suggested Value">
                        <Chip
                            label={suggestedSystemStr}
                            size="small"
                            color="warning"
                            icon={<EditIcon fontSize="small" />}
                            sx={{ mr: 0.5 }}
                        />
                    </Tooltip>
                    <Tooltip title="Current Value in DB (for this version)">
                        <Chip label={`(${currentDBStr})`} size="small" variant="outlined" sx={{ fontStyle: 'italic' }} />
                    </Tooltip>
                </>
            ) : (
                <Tooltip title="Current Value in DB (for this version)">
                    <Chip label={currentDBStr} size="small" variant="outlined" />
                </Tooltip>
            )}
        </Box>
    );
};

// Renders a simple comparison between a previous and current string value
const renderSimpleComparison = (currentInDB, fieldNameLabel = "Value") => { // Removed prevInDB
    const currentStr = (currentInDB === null || currentInDB === undefined || currentInDB === '') ? 'N/A' : currentInDB;

    return (
        <Tooltip title={`Current ${fieldNameLabel} in DB (for this version)`}>
            <Chip label={currentStr} size="small" variant="outlined" />
        </Tooltip>
    );
};

// Helper to format values for the details modal
const formatModalValue = (value, unit = '') => {
    if (value === null || value === undefined || value.toString().trim() === '') return 'N/A';
    return `${value}${unit}`.trim(); // Ensure no leading/trailing spaces if unit is empty
};

// Details Modal Component
const ShipDataDetailsModal = ({ open, onClose, rowData, allColumnDefinitions, correctableFieldsInfo }) => {
    if (!rowData) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                Ship Data Details - IMO: {rowData.id?.imoCode || 'N/A'}, Version: {rowData.id?.versionNumber || 'N/A'}
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    {allColumnDefinitions
                        .filter(colDef => colDef.id !== 'actions') // Don't show actions column in modal
                        .map(colDef => {
                            const isCorrectableField = correctableFieldsInfo.find(cf => cf.id === colDef.id);
                            const currentValue = rowData[colDef.id];
                            let suggestedValue;
                            let unit = '';

                            if (isCorrectableField) {
                                suggestedValue = rowData[`${colDef.id}Corrected`];
                                unit = isCorrectableField.unit || '';
                            }

                            const displayCurrent = formatModalValue(currentValue, unit);
                            let displaySuggested = null;
                            let showSuggestionInModal = false;

                            if (isCorrectableField) {
                                const tempSuggested = formatModalValue(suggestedValue, unit);
                                if (tempSuggested !== 'N/A' && tempSuggested !== displayCurrent) {
                                    displaySuggested = tempSuggested;
                                    showSuggestionInModal = true;
                                }
                            }

                            // Handle date formatting for specific fields in modal
                            let finalDisplayCurrent = displayCurrent;
                            if ((colDef.id === 'constructionDate' || colDef.id === 'versionDate') && currentValue) {
                                finalDisplayCurrent = formatDate(currentValue);
                            }

                            return (
                                <Grid item xs={12} sm={6} md={4} key={colDef.id}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        {colDef.label}
                                    </Typography>
                                    {showSuggestionInModal ? (
                                        <Box>
                                            <Chip label={`Current: ${finalDisplayCurrent}`} size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
                                            <Chip label={`Suggested: ${displaySuggested}`} size="small" color="warning" />
                                        </Box>
                                    ) : (
                                        <Typography variant="body1">{finalDisplayCurrent}</Typography>
                                    )}
                                </Grid>
                            );
                        })}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};


const ShipDataEnhancement = () => {
    const [shipDataSuggestions, setShipDataSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [showOnlyWithCorrections, setShowOnlyWithCorrections] = useState(false);
    const [displayedColumns, setDisplayedColumns] = useState([]);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false); // State for details modal
    const [selectedRowForDetails, setSelectedRowForDetails] = useState(null); // State for selected row data

    // Define which columns are always visible and their order
    const CORE_VISIBLE_COLUMN_IDS = [
        'shipName', 'shipType', 'imoCode', 'versionNumber', 'versionDate'
    ];
    const TRAILING_VISIBLE_COLUMN_IDS = ['errorConfidence', 'actions'];

    // Define data fields that can have corrections and might be conditionally shown
    const CORRECTABLE_DATA_FIELDS = [
        { id: 'breadthMoulded', label: 'Breadth Moulded (m)', minWidth: 180, unit: 'm', description: 'The greatest breadth of the ship measured between the inside edges of the shell plating.' },
        { id: 'deadweight', label: 'Deadweight (T)', minWidth: 180, unit: 'T', description: "The sum of all the variable weights that a ship is capable of carrying safely. In practice, it measures a ship\'s commercial capacity by the weight it is capable of carrying." },
        { id: 'gt', label: 'Gross Tonnage', minWidth: 180, unit: '', description: 'Volume of all the interior spaces of a ship, measured from the keel to the chimney' }, // GT usually has no unit displayed with value
        { id: 'lbp', label: 'LBP (m)', minWidth: 180, unit: 'm', description: 'Length between perpendiculars. Distance between the forward perpendicular and the reverse perpendicular' },
        { id: 'loa', label: 'LOA (m)', minWidth: 180, unit: 'm', description: 'Length overall. Length measurement' },
        { id: 'nt', label: 'Net Tonnage (T)', minWidth: 180, unit: 'T', description: 'Net tonnage. Volume of all spaces on the ship used for the transportation of cargo or passengers' },
        { id: 'maximumDraught', label: 'Max Draught (m)', minWidth: 180, unit: 'm', description: "Maximum draft is the vertical distance between the surface of the water and the lowest part of the ship\'s keel, when the ship is at full displacement (or maximum displacement)." },
        { id: 'tonnage', label: 'Tonnage (T)', minWidth: 180, unit: 'T', description: 'The total number of tons registered or carried or the total carrying capacity.' },
        { id: 'teuCapacity', label: 'TEU Capacity (TEU)', minWidth: 180, unit: ' TEU', description: 'Maximum number of containers the ship can carry' },
        { id: 'maxSpeed', label: 'Max Speed (knots)', minWidth: 180, unit: ' knots', description: 'Max speed of the ship' },
        // SBT and ConstructionDate are omitted as they don't have a ...Corrected field for comparison
        // and are not in the ALWAYS_VISIBLE_COLUMN_IDS list.
    ];

    // Function to get all possible column definitions
    const getMasterColumnList = () => {
        let masterList = [
            { id: 'shipName', label: 'Ship Name', minWidth: 200, render: (row) => renderSimpleComparison(row.shipName, 'Ship Name'), description: 'Name of the ship' },
            { id: 'shipType', label: 'Ship Type', minWidth: 200, render: (row) => renderSimpleComparison(row.shipType, 'Ship Type'), description: 'Type of the ship' },
            { id: 'imoCode', label: 'IMO Code', minWidth: 100, format: (row) => row.id?.imoCode || 'N/A', description: 'Unambiguous code of the International Maritime Organization that identifies each ship' },
            { id: 'versionNumber', label: 'Version', minWidth: 80, format: (row) => row.id?.versionNumber || 'N/A', description: 'Number of the version' },
            { id: 'versionDate', label: 'Version Date', minWidth: 170, format: (row) => formatDate(row.versionDate), description: 'Date of the version' },
            {
                id: 'errorConfidence', label: 'Confidence', minWidth: 100,
                format: (row) => (
                    <Chip
                        label={row.errorConfidence !== null ? row.errorConfidence.toString() : 'N/A'}
                        color={row.errorConfidence >= 4 ? "error" : row.errorConfidence >= 2 ? "warning" : "default"}
                        size="small"
                    />
                ),
                description: 'Confidence score of the error detection algorithm for this version\'s data.'
            },
            { id: 'actions', label: 'Actions', minWidth: 130, align: 'center', description: 'Actions to perform on the suggestion (Accept/Reject).' },
        ];

        CORRECTABLE_DATA_FIELDS.forEach(field => {
            masterList.push({
                id: field.id,
                label: field.label,
                minWidth: field.minWidth,
                render: (row) => renderChangeValue(row[field.id], row[`${field.id}Corrected`], field.unit),
                description: field.description
            });
        });
        return masterList;
    };

    useEffect(() => {
        fetchSuggestions();
    }, [page, rowsPerPage]);

    const fetchSuggestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_BASE_URL, {
                params: {
                    page: page,
                    size: rowsPerPage,
                    // Add any default sorting if necessary, e.g., sort: 'id.imoCode,ASC'
                },
            });

            // Correctly parse the API response structure
            if (response.data && response.data._embedded && response.data._embedded.shipDataEnhancementList) {
                setShipDataSuggestions(response.data._embedded.shipDataEnhancementList);
                if (response.data.page) {
                    setTotalElements(response.data.page.totalElements || 0);
                } else {
                    setTotalElements(response.data._embedded.shipDataEnhancementList.length); // Fallback if page info is missing
                }
            } else {
                console.warn("Unexpected API response structure:", response.data);
                setShipDataSuggestions([]);
                setTotalElements(0);
            }
        } catch (err) {
            console.error("Error fetching ship data suggestions:", err);
            setError(err.message || 'Failed to fetch suggestions.');
            setShipDataSuggestions([]);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleAcceptSuggestion = async (suggestionId) => {
        if (!suggestionId || !suggestionId.imoCode || !suggestionId.versionNumber) {
            console.error("Invalid suggestionId for accept:", suggestionId);
            setError("Invalid data for approving suggestion.");
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/approve`, {
                imoCode: suggestionId.imoCode,
                versionNumber: suggestionId.versionNumber,
            });
            fetchSuggestions(); // Refetch data to update the list
        } catch (err) {
            console.error("Error accepting suggestion:", err);
            setError(err.response?.data?.message || err.message || 'Failed to accept suggestion.');
            setLoading(false); // Stop loading only if there's an error, fetchSuggestions will handle it otherwise
        }
    };

    const handleRejectSuggestion = async (suggestionId) => {
        if (!suggestionId || !suggestionId.imoCode || !suggestionId.versionNumber) {
            console.error("Invalid suggestionId for reject:", suggestionId);
            setError("Invalid data for rejecting suggestion.");
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/delete`, { // Assuming /delete is the endpoint for rejecting
                imoCode: suggestionId.imoCode,
                versionNumber: suggestionId.versionNumber,
            });
            fetchSuggestions(); // Refetch data to update the list
        } catch (err) {
            console.error("Error rejecting suggestion:", err);
            setError(err.response?.data?.message || err.message || 'Failed to reject suggestion.');
            setLoading(false); // Stop loading only if there's an error, fetchSuggestions will handle it otherwise
        }
    };

    // Helper function to determine if a row has correctable suggestions (for row filtering)
    const valToStringForCheck = (val) => {
        if (val === null || val === undefined || val.toString().trim() === '') return 'N/A';
        return val.toString().trim();
    };

    const hasCorrections = (row) => {
        return CORRECTABLE_DATA_FIELDS.some(field => {
            const currentValue = valToStringForCheck(row[field.id]);
            const correctedValue = valToStringForCheck(row[`${field.id}Corrected`]);
            return correctedValue !== 'N/A' && currentValue !== correctedValue;
        });
    };

    const filteredSuggestions = showOnlyWithCorrections
        ? shipDataSuggestions.filter(hasCorrections)
        : shipDataSuggestions;

    useEffect(() => {
        const masterColumnList = getMasterColumnList();
        const activeCorrectableColumnIDs = new Set();

        if (filteredSuggestions && filteredSuggestions.length > 0) {
            CORRECTABLE_DATA_FIELDS.forEach(field => {
                const hasChangeInAnyRow = filteredSuggestions.some(row => {
                    const currentValue = valToStringForCheck(row[field.id]);
                    const correctedValue = valToStringForCheck(row[`${field.id}Corrected`]);
                    return correctedValue !== 'N/A' && currentValue !== correctedValue;
                });
                if (hasChangeInAnyRow) {
                    activeCorrectableColumnIDs.add(field.id);
                }
            });
        }

        const columnsToShow = [];

        CORE_VISIBLE_COLUMN_IDS.forEach(id => {
            const colDef = masterColumnList.find(c => c.id === id);
            if (colDef) columnsToShow.push(colDef);
        });

        CORRECTABLE_DATA_FIELDS.forEach(field => {
            if (activeCorrectableColumnIDs.has(field.id)) {
                const colDef = masterColumnList.find(c => c.id === field.id);
                if (colDef) columnsToShow.push(colDef);
            }
        });

        TRAILING_VISIBLE_COLUMN_IDS.forEach(id => {
            const colDef = masterColumnList.find(c => c.id === id);
            if (colDef) columnsToShow.push(colDef);
        });

        setDisplayedColumns(columnsToShow);

    }, [filteredSuggestions]);

    const handleViewDetails = (row) => {
        setSelectedRowForDetails(row);
        setDetailsModalOpen(true);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', p: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" gutterBottom component="div" >
                    Ship Data Enhancement Suggestions
                </Typography>
                <FormControlLabel
                    control={<Switch checked={showOnlyWithCorrections} onChange={(e) => setShowOnlyWithCorrections(e.target.checked)} />}
                    label="Show only entries with suggestions"
                />
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            }

            <TableContainer sx={{ maxHeight: 700 }}>
                <Table stickyHeader aria-label="ship data enhancement table">
                    <TableHead>
                        <TableRow>
                            {displayedColumns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align || 'left'}
                                    style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {column.label}
                                        {column.description && (
                                            <Tooltip title={column.description} arrow>
                                                <IconButton size="small" sx={{ ml: 0.5 }}>
                                                    <InfoIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={displayedColumns.length} align="center">
                                    <CircularProgress />
                                    <Typography sx={{ mt: 1 }}>Loading Suggestions...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredSuggestions.length === 0 && !error ? (
                            <TableRow>
                                <TableCell colSpan={displayedColumns.length} align="center">
                                    <Typography>No suggestions available at the moment.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSuggestions.map((row, index) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={`${row.id?.imoCode}-${row.id?.versionNumber}-${index}`}>
                                    {displayedColumns.map((column) => {
                                        // Treat empty strings as 'N/A' for general cell values if no specific format/render
                                        const cellValue = column.format ?
                                            column.format(row) :
                                            (row[column.id] !== null && row[column.id] !== undefined && row[column.id].toString().trim() !== '' ?
                                                row[column.id] :
                                                'N/A');
                                        return (
                                            <TableCell key={column.id} align={column.align || 'left'} sx={{ verticalAlign: 'top' }}>
                                                {column.id === 'actions' ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: column.align === 'center' ? 'center' : 'flex-start' }}>
                                                        <Tooltip title="View Full Details">
                                                            <IconButton
                                                                color="primary"
                                                                size="small"
                                                                onClick={() => handleViewDetails(row)}
                                                                sx={{ mr: 0.5 }} // Adjusted margin for closer spacing
                                                            >
                                                                <VisibilityIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Accept Suggestion">
                                                            <IconButton
                                                                color="success"
                                                                size="small"
                                                                onClick={() => handleAcceptSuggestion(row.id)}
                                                                sx={{ mr: 0.5 }} // Adjusted margin
                                                            >
                                                                <CheckCircleOutlineIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Reject Suggestion">
                                                            <IconButton
                                                                color="error"
                                                                size="small"
                                                                onClick={() => handleRejectSuggestion(row.id)}
                                                            >
                                                                <HighlightOffIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                ) : column.render ? (
                                                    column.render(row)
                                                ) : (
                                                    cellValue
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table >
            </TableContainer >
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalElements}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <ShipDataDetailsModal
                open={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                rowData={selectedRowForDetails}
                allColumnDefinitions={getMasterColumnList()} // Pass all column definitions for the modal
                correctableFieldsInfo={CORRECTABLE_DATA_FIELDS} // Pass correctable fields info
            />
        </Paper >
    );
};

export default ShipDataEnhancement;

