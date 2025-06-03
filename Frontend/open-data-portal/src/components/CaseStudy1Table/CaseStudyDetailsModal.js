import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Chip
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import ScaleIcon from '@mui/icons-material/Scale';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const CaseStudyDetailsModal = ({ open, handleClose, selectedCaseStudy }) => {
  if (!open) return null;

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
        <LocalShippingIcon sx={{ mr: 1 }} />
        <Typography variant="h6">
          Cargo Container Details - {selectedCaseStudy?.containerPlate || 'Loading...'}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {!selectedCaseStudy ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography>Loading case study details...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Container Information Section */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#457985', fontWeight: 'bold' }}>
                  <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Container Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">Container ID</Typography>
                    <Typography variant="body1">{selectedCaseStudy.id || 'N/A'}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">Container Plate</Typography>
                    <Typography variant="body1">{selectedCaseStudy.containerPlate || 'N/A'}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">State</Typography>
                    <Chip
                      label={selectedCaseStudy.containerState || 'Unknown'}
                      color={selectedCaseStudy.containerState === "Active" ? "success" : "default"}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">ISO Container</Typography>
                    <Typography variant="body1">{selectedCaseStudy.isoContentainer || 'N/A'}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">ISO Registry</Typography>
                    <Typography variant="body1">{selectedCaseStudy.isoContentainerRegistry || 'N/A'}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">Container Tare</Typography>
                    <Typography variant="body1">{selectedCaseStudy.containerTare || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Cargo Information Section */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#457985', fontWeight: 'bold' }}>
                  <ScaleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Cargo Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Cargo Description</Typography>
                    <Typography variant="body1">{selectedCaseStudy.cargoDescription || 'N/A'}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">Weight (kg)</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedCaseStudy.weight?.toLocaleString() || 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">Departure Weight</Typography>
                    <Typography variant="body1">
                      {selectedCaseStudy.departureWeight?.toLocaleString() || 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">Packages Quantity</Typography>
                    <Typography variant="body1">{selectedCaseStudy.packagesQuantity || 'N/A'}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">Broken Packages</Typography>
                    <Typography variant="body1">{selectedCaseStudy.brokenPackagesQuantity || '0'}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">Harmonized Code</Typography>
                    <Typography variant="body1" color="#457985" sx={{ fontFamily: 'monospace' }}>
                      {selectedCaseStudy.harmonizedCode || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Shipping Information Section */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#457985', fontWeight: 'bold' }}>
                  <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Shipping Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">Movement Date</Typography>
                    <Typography variant="body1">
                      <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                      {selectedCaseStudy.movementDate || 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">Embarkation Port</Typography>
                    <Typography variant="body1">{selectedCaseStudy.embarkationPort || 'N/A'}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">Disembarkation Port</Typography>
                    <Typography variant="body1">{selectedCaseStudy.disembarkationPort || 'N/A'}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">Transhipment</Typography>
                    <Typography variant="body1">{selectedCaseStudy.transhipment || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Classification Codes Section */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#457985', fontWeight: 'bold' }}>
                  Classification Codes
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ border: '1px solid #ddd', p: 1.5, borderRadius: 1, bgcolor: 'white', height: '100%' }}>
                      <Typography variant="subtitle2" color="text.secondary">NST 2P</Typography>
                      <Typography variant="h6" color="#457985" sx={{ fontFamily: 'monospace' }}>
                        {selectedCaseStudy.nst20072P || 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        {selectedCaseStudy.nst20072PLabelEN || 'No description'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ border: '1px solid #ddd', p: 1.5, borderRadius: 1, bgcolor: 'white' }}>
                      <Typography variant="subtitle2" color="text.secondary">NST 3P</Typography>
                      <Typography variant="h6" color="#457985" sx={{ fontFamily: 'monospace' }}>
                        {selectedCaseStudy.nst20073P || 'N/A'}
                      </Typography>
                      <Typography variant="body2" noWrap>
                        {selectedCaseStudy.nst20073PLabelEN || 'No description'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ border: '1px solid #ddd', p: 1.5, borderRadius: 1, bgcolor: 'white' }}>
                      <Typography variant="subtitle2" color="text.secondary">Data Prov</Typography>
                      <Typography variant="h6" color="#457985" sx={{ fontFamily: 'monospace' }}>
                        {selectedCaseStudy.prov2 || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClose}
        >
          Close Details
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CaseStudyDetailsModal;