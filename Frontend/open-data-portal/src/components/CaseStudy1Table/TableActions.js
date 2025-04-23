import React from 'react';
import { Grid, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';

const buttonStyle = {
  height: '56px',
  color: '#457985',
  borderColor: '#457985',
  '&:hover': {
    borderColor: '#457985',
    backgroundColor: 'rgba(69, 121, 133, 0.04)',
  }
};

const TableActions = ({ handleOpenColumnModal, handleDownload }) => {
  return (
    <Grid container spacing={2} justifyContent="flex-end">
      <Grid item>
        <Button
          variant="outlined"
          startIcon={<SettingsIcon />}
          onClick={handleOpenColumnModal}
          sx={buttonStyle}
        >
          Columns
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={buttonStyle}
        >
          Download
        </Button>
      </Grid>
    </Grid>
  );
};

export default TableActions;