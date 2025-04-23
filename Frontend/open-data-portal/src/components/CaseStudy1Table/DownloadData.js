import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Grid,
    Typography,
    Divider,
    Box,
    CircularProgress,
    Paper
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export default function DownloadData({ open, onClose, allColumns, defaultSelectedColumns, onDownload }) {
    const [selectedColumns, setSelectedColumns] = useState({});
    const [format, setFormat] = useState('json'); // Default format
    const [isDownloading, setIsDownloading] = useState(false);

    // Reset selections when modal opens or defaultSelectedColumns changes
    useEffect(() => {
        if (open) {
            const initialSelections = allColumns.reduce((acc, col) => {
                acc[col.id] = (defaultSelectedColumns || []).includes(col.id);
                return acc;
            }, {});
            setSelectedColumns(initialSelections);
        }
    }, [open, defaultSelectedColumns, allColumns]);

    const handleColumnSelectionChange = (columnId) => {
        setSelectedColumns((prev) => ({
            ...prev,
            [columnId]: !prev[columnId],
        }));
    };

    const handleFormatChange = (event) => {
        setFormat(event.target.value);
    };

    const handleDownload = () => {
        const selectedColumnIds = Object.keys(selectedColumns).filter((id) => selectedColumns[id]);

        if (selectedColumnIds.length === 0) {
            alert('Please select at least one column to download');
            return;
        }

        setIsDownloading(true);

        // Pass setIsDownloading to onDownload
        onDownload(selectedColumnIds, format, setIsDownloading);

        // Close the modal
        onClose();
    };

    const handleSelectAll = () => {
        const allSelected = allColumns.reduce((acc, col) => {
            acc[col.id] = true;
            return acc;
        }, {});
        setSelectedColumns(allSelected);
    };

    const handleDeselectAll = () => {
        const noneSelected = allColumns.reduce((acc, col) => {
            acc[col.id] = false;
            return acc;
        }, {});
        setSelectedColumns(noneSelected);
    };

    const handleResetToDefault = () => {
        const defaultSelected = allColumns.reduce((acc, col) => {
            acc[col.id] = (defaultSelectedColumns || []).includes(col.id);
            return acc;
        }, {});
        setSelectedColumns(defaultSelected);
    };

    const countSelectedColumns = () => {
        return Object.values(selectedColumns).filter(Boolean).length;
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                elevation: 3,
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ bgcolor: '#457985', color: 'white', display: 'flex', alignItems: 'center' }}>
                <DownloadIcon sx={{ mr: 1 }} />
                <Box>
                    <Typography variant="h6">Download Data</Typography>
                    <Typography variant="subtitle2" sx={{ mt: 0.5, opacity: 0.9 }}>
                        Select columns and format for download
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                    <Box sx={{ mb: 2 }}>
                        <Button 
                            variant="outlined" 
                            onClick={handleDeselectAll} 
                            sx={{ mr: 1 }}
                        >
                            Deselect All
                        </Button>
                        <Button 
                            variant="outlined" 
                            onClick={handleResetToDefault}
                        >
                            Reset to Default
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 2 }}
                    >
                        Selected: {countSelectedColumns()}/{allColumns.length} columns
                    </Typography>

                    <Grid container spacing={2}>
                        {allColumns.map((column) => (
                            <Grid item xs={12} sm={6} md={4} key={column.id}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedColumns[column.id] || false}
                                            onChange={() => handleColumnSelectionChange(column.id)}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            {column.label}
                                        </Typography>
                                    }
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                        <InputLabel id="format-select-label">Download Format</InputLabel>
                        <Select
                            labelId="format-select-label"
                            value={format}
                            onChange={handleFormatChange}
                            label="Download Format"
                        >
                            <MenuItem value="json">JSON</MenuItem>
                            <MenuItem value="csv">CSV</MenuItem>
                            <MenuItem value="parquet">Parquet</MenuItem>
                        </Select>
                    </FormControl>
                </Paper>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={handleDownload}
                    color="primary"
                    variant="contained"
                    disabled={isDownloading || countSelectedColumns() === 0}
                    startIcon={isDownloading ? <CircularProgress size={16} /> : null}
                >
                    {isDownloading ? 'Downloading...' : 'Download'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}