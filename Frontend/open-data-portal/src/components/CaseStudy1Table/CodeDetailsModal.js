import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
  Paper
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';

const CodeDetailsModal = ({ open, handleClose, title, details }) => {
  if (!open || !details) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 3,
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#457985', color: 'white', display: 'flex', alignItems: 'center' }}>
        <CodeIcon sx={{ mr: 1 }} />
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
          {/* Main code info */}
          <Typography variant="h6" sx={{ color: '#457985', fontWeight: 'bold', mb: 1 }}>
            {details.code}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {details.description}
          </Typography>

          {/* Single related code (for 3-digit) */}
          {details.relatedCode && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ color: '#457985', fontWeight: 'bold', mb: 1 }}>
                {details.relatedCode.label}
              </Typography>
              <Typography variant="h6" sx={{ fontFamily: 'monospace', color: '#457985' }}>
                {details.relatedCode.code}
              </Typography>
              <Typography variant="body1">
                {details.relatedCode.description}
              </Typography>
            </Box>
          )}

          {/* Multiple related codes (for 8-digit) */}
          {details.relatedCodes && details.relatedCodes.map((relatedCode, index) => (
            <Box key={index} sx={{ mt: 2 }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ color: '#457985', fontWeight: 'bold', mb: 1 }}>
                {relatedCode.label}
              </Typography>
              <Typography variant="h6" sx={{ fontFamily: 'monospace', color: '#457985' }}>
                {relatedCode.code}
              </Typography>
              <Typography variant="body1">
                {relatedCode.description}
              </Typography>
            </Box>
          ))}
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CodeDetailsModal;