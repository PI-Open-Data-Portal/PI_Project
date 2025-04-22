import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Divider,
  Box,
  Grid,
  Paper
} from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

const ColumnSelectionModal = ({
  open,
  handleClose,
  allColumns,
  columnSelections,
  handleColumnSelectionChange,
  handleDeselectAllColumns,
  handleResetToDefault,
  handleSaveColumnSelections,
  countSelectedColumns,
  maxColumns
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        elevation: 3,
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#457985', color: 'white', display: 'flex', alignItems: 'center' }}>
        <ViewColumnIcon sx={{ mr: 1 }} />
        <Box>
          <Typography variant="h6">Customize Table Columns</Typography>
          <Typography variant="subtitle2" sx={{ mt: 0.5, opacity: 0.9 }}>
            Select up to {maxColumns} columns to display
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Button 
              variant="outlined" 
              onClick={handleDeselectAllColumns} 
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
            Selected: {countSelectedColumns(columnSelections)}/{maxColumns} columns
          </Typography>

          <Grid container spacing={2}>
            {allColumns.map((column) => (
              <Grid item xs={12} sm={6} md={4} key={column.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={columnSelections[column.id] || false}
                      onChange={() => handleColumnSelectionChange(column.id)}
                      disabled={column.id === 'id'}
                    />
                  }
                  label={
                    <Typography 
                      variant="body2" 
                      color={column.id === 'id' ? 'text.secondary' : 'text.primary'}
                    >
                      {column.label}
                    </Typography>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button 
          onClick={handleSaveColumnSelections} 
          color="primary" 
          variant="contained"
        >
          Apply Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColumnSelectionModal;