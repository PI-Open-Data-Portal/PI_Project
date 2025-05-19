import React, { useState, useRef, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Avatar, 
  Chip,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  LinearProgress,
  Pagination,
  Stack,
  Slider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import W3Canalysis from '../components/Admin/W3CanalysisTable';
import W3CanalysisGraphs from '../components/Admin/W3CanalysisGraphs';
import W3CanalysisGraphs2 from '../components/Admin/W3CAnalysisGraphs2';

import logo from "../assets/logopng.png";

// Importando ícones
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import TableChartIcon from '@mui/icons-material/TableChart';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorageIcon from '@mui/icons-material/Storage';
import CommentIcon from '@mui/icons-material/Comment';
import DownloadIcon from '@mui/icons-material/Download';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import PersonIcon from '@mui/icons-material/Person';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const drawerWidth = 240;

// URL base da API
const API_BASE_URL = 'http://localhost:8080';

// Dados de exemplo para os cards
const cardData = [
  { title: 'Users', value: '2,567', icon: <PersonIcon sx={{ fontSize: 40, color: '#FF9800' }} /> },
  { title: 'Admins', value: '48', icon: <AdminPanelSettingsIcon sx={{ fontSize: 40, color: '#2196F3' }} /> },
  { title: 'Tables', value: '156', icon: <TableChartIcon sx={{ fontSize: 40, color: '#4CAF50' }} /> },
  { title: 'Databases', value: '12', icon: <StorageIcon sx={{ fontSize: 40, color: '#9C27B0' }} /> },
  { title: 'Reports', value: '783', icon: <CommentIcon sx={{ fontSize: 40, color: '#E91E63' }} /> },
  { title: 'Downloads', value: '1,568', icon: <DownloadIcon sx={{ fontSize: 40, color: '#F44336' }} /> },
];
  
// Mapeamento de tipos de erro para ícones e cores
const errorTypeMapping = {
  'missing_information': { icon: <WarningIcon />, color: 'warning' },
  'invalid_format': { icon: <ErrorIcon />, color: 'error' },
  'duplicate_entry': { icon: <WarningIcon />, color: 'warning' },
  'validation_error': { icon: <ErrorIcon />, color: 'error' },
  'data_mismatch': { icon: <WarningIcon />, color: 'warning' },
  'other': { icon: <ErrorIcon />, color: 'info' }
};

// Mapeamento de status para cores
const statusColorMapping = {
  'Unresolved': 'warning',
  'Resolved': 'success',
  'In Progress': 'info'
};

function AdminDashboard() {
    const [errorReports, setErrorReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [errorTypeFilter, setErrorTypeFilter] = useState('');
    const [itemIdFilter, setItemIdFilter] = useState('');
    const [openErrorModal, setOpenErrorModal] = useState(false);
    const [selectedError, setSelectedError] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
    
    // User state variables
    const [users, setUsers] = useState([]);
    const [userLoading, setUserLoading] = useState(false);
    const [userError, setUserError] = useState(null);
    const [page, setPage] = useState(1);
    const usersPerPage = 6;
    const [totalPages, setTotalPages] = useState(1);

    // Add these state variables to your existing state declarations
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    permissions: []
    });
    const [availablePermissions] = useState([
    'USER_READ',
    'USER_WRITE',
    'USER_DELETE',
    'ADMIN',
    'REPORT_READ',
    'REPORT_WRITE',
    'SYSTEM_SETTINGS'
    ]);

    // Function to handle opening the edit modal
const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      permissions: user.permissions || []
    });
    setOpenEditModal(true);
  };
  
  // Function to handle closing the edit modal
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedUser(null);
  };
  
  // Function to handle form field changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  
  // Function to handle permissions multi-select changes
  const handlePermissionsChange = (e) => {
    setEditFormData({
      ...editFormData,
      permissions: e.target.value
    });
  };
  
  // Function to save user changes
  const handleSaveUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/apiV1/auth/users/${selectedUser.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editFormData.name,
          permissions: editFormData.permissions
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error updating user: ${response.statusText}`);
      }
  
      // Show success notification
      setNotification({
        open: true,
        message: `User ${editFormData.name} updated successfully`,
        severity: 'success'
      });
  
      // Close the modal and refresh the user list
      handleCloseEditModal();
      fetchUsers();
    } catch (err) {
      console.error('Failed to update user:', err);
      setNotification({
        open: true,
        message: `Failed to update user: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle opening the delete confirmation dialog
  const handleOpenDeleteConfirmation = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };
  
  // Function to delete a user
  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/apiV1/auth/users/${selectedUser.email}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`Error deleting user: ${response.statusText}`);
      }
  
      // Show success notification
      setNotification({
        open: true,
        message: `User ${selectedUser.name} deleted successfully`,
        severity: 'success'
      });
  
      // Close the dialog and refresh the user list
      setOpenDeleteDialog(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
      setNotification({
        open: true,
        message: `Failed to delete user: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };


    // Function to handle opening the error modal
    const handleOpenErrorModal = (error) => {
        setSelectedError(error);
        setOpenErrorModal(true);
    };

    const downloadErrorReports = async () => {
        try {
            // Show loading notification
            setNotification({
                open: true,
                message: 'Preparing download...',
                severity: 'info'
            });
            
            // Construct URL with current filters
            let url = `${API_BASE_URL}/apiV1/errorReports/download`;
            const params = new URLSearchParams();
            
            if (statusFilter) params.append('status', statusFilter);
            if (errorTypeFilter) params.append('errorType', errorTypeFilter);
            if (itemIdFilter) params.append('itemId', itemIdFilter);
            
            const queryString = params.toString();
            if (queryString) url += `?${queryString}`;
            
            // Fetch the file as blob
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error downloading reports: ${response.statusText}`);
            }
            
            // Get the blob from the response
            const blob = await response.blob();
            
            // Create a download link and trigger download
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            
            // Get filename from Content-Disposition header or use default
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'error-reports.csv';
            
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch.length === 2) {
                    filename = filenameMatch[1];
                }
            }
            
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            // Clean up the URL object
            window.URL.revokeObjectURL(downloadUrl);
            
            setNotification({
                open: true,
                message: 'Reports downloaded successfully',
                severity: 'success'
            });
        } catch (err) {
            console.error('Failed to download error reports:', err);
            
            setNotification({
                open: true,
                message: `Failed to download reports: ${err.message}`,
                severity: 'error'
            });
        }
    };

    // Function to fetch users from the API
    const fetchUsers = async () => {
        setUserLoading(true);
        setUserError(null);
        
        try {
            const response = await fetch(`${API_BASE_URL}/apiV1/auth/users`);
            
            if (!response.ok) {
                throw new Error(`Error fetching users: ${response.statusText}`);
            }
            
            const data = await response.json();
            setUsers(data);
            
            // Calculate total pages based on API response
            setTotalPages(Math.ceil(data.length / usersPerPage));
            
            setNotification({
                open: true,
                message: 'Users loaded successfully',
                severity: 'success'
            });
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setUserError(err.message);
            
            setNotification({
                open: true,
                message: `Failed to load users: ${err.message}`,
                severity: 'error'
            });
        } finally {
            setUserLoading(false);
        }
    };

    // Load the users when the component mounts
    useEffect(() => {
        fetchUsers();
        fetchErrorReports();
    }, []);


    // Função para buscar os relatórios de erro da API
    const fetchErrorReports = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Construindo a URL com os parâmetros de filtro
            let url = `${API_BASE_URL}/apiV1/errorReports`;
            const params = new URLSearchParams();
            
            if (statusFilter) params.append('status', statusFilter);
            if (errorTypeFilter) params.append('errorType', errorTypeFilter);
            if (itemIdFilter) params.append('itemId', itemIdFilter);
            
            const queryString = params.toString();
            if (queryString) url += `?${queryString}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error fetching error reports: ${response.statusText}`);
            }
            
            const data = await response.json();
            setErrorReports(data);
            setFilteredReports(data);
            
            setNotification({
                open: true,
                message: 'Error reports loaded successfully',
                severity: 'success'
            });
        } catch (err) {
            console.error('Failed to fetch error reports:', err);
            setError(err.message);
            
            setNotification({
                open: true,
                message: `Failed to load error reports: ${err.message}`,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const markAsResolved = async (errorId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/apiV1/errorReports/${errorId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                },
                body: JSON.stringify({ status: 'Resolved' })
            });
    
            if (!response.ok) {
                throw new Error(`Erro ao atualizar: ${response.statusText}`);
            }
    
            setNotification({
                open: true,
                message: `Erro #${errorId} marcado como resolvido`,
                severity: 'success'
            });
    
            setOpenErrorModal(false);
            fetchErrorReports(); // Atualiza a lista após a mudança
        } catch (err) {
            setNotification({
                open: true,
                message: `Falha ao atualizar erro: ${err.message}`,
                severity: 'error'
            });
        }
    };

    const markAsInProgress = async (errorId) => {
        try {
            // Check the exact format your API expects
            // Try different request formats if this one doesn't work
            const response = await fetch(`${API_BASE_URL}/apiV1/errorReports/${errorId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                },
                // The API might be expecting a different payload format
                body: JSON.stringify({ 
                    errorId: errorId,
                    status: 'In Progress' 
                })
            });
    
            if (!response.ok) {
                console.error('Error response:', response.status, response.statusText);
                throw new Error(`Erro ao atualizar: ${response.statusText}`);
            }
    
            setNotification({
                open: true,
                message: `Erro #${errorId} marcado como em progresso`,
                severity: 'info'
            });
    
            setOpenErrorModal(false);
            fetchErrorReports(); // Atualiza a lista após a mudança
        } catch (err) {
            console.error('Update error:', err);
            setNotification({
                open: true,
                message: `Falha ao atualizar erro: ${err.message}`,
                severity: 'error'
            });
        }
    };

    const handleSeverityChange = async (errorId, severity) => {
        try {
            const response = await fetch(`${API_BASE_URL}/apiV1/errorReports`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ errorId, severity }),
            });
            
            if (response.ok) {
                // Update local state to reflect the change
                setFilteredReports(prev => 
                    prev.map(report => 
                        report.id === errorId ? { ...report, severity } : report
                    )
                );
                

            } else {

            }
        } catch (error) {
            console.error('Error updating severity:', error);
        }
    };
    
    // Função para formatar a data para exibição
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Função para aplicar filtros
    const applyFilters = () => {
        fetchErrorReports();
    };

    // Função para limpar filtros
    const clearFilters = () => {
        setStatusFilter('');
        setErrorTypeFilter('');
        setItemIdFilter('');
        fetchErrorReports();
    };

    // Carregar os dados quando o componente montar
    useEffect(() => {
        fetchErrorReports();
    }, []);

    const [open, setOpen] = React.useState(true);

    // Refs para scroll
    const DashRef = useRef(null);
    const reportsRef = useRef(null);
    const usersRef = useRef(null);
    const tablesRef = useRef(null);
    const chartsRef = useRef(null);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    // Calculate the current displayed users based on pagination
    const indexOfLastUser = page * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);


    return (
        <Box sx={{ display: 'flex' }}>
            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setNotification({ ...notification, open: false })} 
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>

            {/* AppBar */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'white', color: 'black', boxShadow: 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={toggleDrawer}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <img src={logo} style={{ height: 70, marginRight: 10 }} alt="Logo" />
                        <Typography variant="h5" noWrap component="div">
                            Admin Page
                        </Typography>
                    </Box>
                    <IconButton color="inherit">
                        <NotificationsIcon />
                    </IconButton>
                    <IconButton color="inherit">
                        <EmailIcon />
                    </IconButton>
                    <IconButton color="inherit">
                        <AccountCircleIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: '#457884',
                        color: 'white',
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto', pt: 2 }}>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                        <Avatar alt="Admin" src="/static/images/avatar/1.jpg" sx={{ mr: 2 }} />
                        <Box>
                            <Typography variant="subtitle1" sx={{ color: 'white' }}>Bruno Tavares</Typography>
                            <Typography variant="body2" sx={{ color: '#4CAF50' }}>Online</Typography>
                        </Box>
                    </Box>
                    <Typography variant="h6" sx={{ px: 2, py: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                        General
                    </Typography>
                    <List>
                    <ListItem button onClick={() => scrollToSection(DashRef)} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                            <ListItemIcon sx={{ color: '#ffffff' }}>
                                <AssessmentIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                        <ListItem button onClick={() => scrollToSection(reportsRef)} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                            <ListItemIcon sx={{ color: '#ffffff' }}>
                                <AssessmentIcon />
                            </ListItemIcon>
                            <ListItemText primary="Data Reports" />
                        </ListItem>
                        <ListItem button onClick={() => scrollToSection(usersRef)} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                            <ListItemIcon sx={{ color: '#ffffff' }}>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Users" />
                        </ListItem>
                        <ListItem button onClick={() => scrollToSection(reportsRef)} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                            <ListItemIcon sx={{ color: '#ffffff' }}>
                                <QueryStatsIcon />
                            </ListItemIcon>
                            <ListItemText primary="W3C Analysis" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            {/* Main content */}
            <Box ref={DashRef} component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
                <Toolbar />
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                    Dashboard
                </Typography>

                {/* Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {cardData.map((card, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={4} xl={2} key={index}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    borderRadius: 2,
                                    height: '100%',
                                }}
                            >
                                {card.icon}
                                <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                                    {card.value}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#757575' }}>
                                    {card.title}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Error Reports Section */}
            <Box ref={reportsRef} sx={{ scrollMarginTop: '64px', mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Error Reports
                </Typography>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                    {/* Filter Controls */}
                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="status-filter-label">Status</InputLabel>
                                    <Select
                                        labelId="status-filter-label"
                                        id="status-filter"
                                        value={statusFilter}
                                        label="Status"
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="Unresolved">Unresolved</MenuItem>
                                        <MenuItem value="Resolved">Resolved</MenuItem>
                                        <MenuItem value="In Progress">In Progress</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="error-type-filter-label">Error Type</InputLabel>
                                    <Select
                                        labelId="error-type-filter-label"
                                        id="error-type-filter"
                                        value={errorTypeFilter}
                                        label="Error Type"
                                        onChange={(e) => setErrorTypeFilter(e.target.value)}
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="missing_information">Missing Information</MenuItem>
                                        <MenuItem value="invalid_format">Invalid Format</MenuItem>
                                        <MenuItem value="duplicate_entry">Duplicate Entry</MenuItem>
                                        <MenuItem value="validation_error">Validation Error</MenuItem>
                                        <MenuItem value="data_mismatch">Data Mismatch</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Item ID"
                                    variant="outlined"
                                    value={itemIdFilter}
                                    onChange={(e) => setItemIdFilter(e.target.value)}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button 
                                        variant="contained" 
                                        startIcon={<FilterListIcon />}
                                        onClick={applyFilters}
                                    >
                                        Filter
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        startIcon={<RefreshIcon />}
                                        onClick={clearFilters}
                                    >
                                        Clear
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">
                            Total Errors: {filteredReports.length}
                            {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
                        </Typography>
                        <Button 
                            variant="contained" 
                            startIcon={<FileDownloadIcon />} 
                            size="small"
                            onClick={downloadErrorReports}
                            disabled={loading || filteredReports.length === 0}
                        >
                            Download Reports
                        </Button>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Divider sx={{ mb: 2 }} />
                    
                    <TableContainer>
                        <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Error ID</TableCell>
                                <TableCell>Error Type</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Item IDs</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Severity</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                            <TableBody>
                                {filteredReports.length > 0 ? (
                                    filteredReports.map((error) => (
                                        <TableRow key={error.id}>
                                            <TableCell>{error.id}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={errorTypeMapping[error.errorType]?.icon || errorTypeMapping.other.icon}
                                                    label={error.errorType?.replace('_', ' ')}
                                                    color={errorTypeMapping[error.errorType]?.color || errorTypeMapping.other.color}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{error.description}</TableCell>
                                            <TableCell>
                                                {error.itemIds?.map((id, index) => (
                                                    <Chip 
                                                        key={index} 
                                                        label={id} 
                                                        size="small" 
                                                        sx={{ mr: 0.5, mb: 0.5 }} 
                                                    />
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={error.status}
                                                    color={statusColorMapping[error.status] || 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(error.createdAt)}</TableCell>
                                            <TableCell>
                                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                                    <Select
                                                        value={error.severity || 'MEDIUM'}
                                                        onChange={(e) => handleSeverityChange(error.id, e.target.value)}
                                                        size="small"
                                                        sx={{ height: "30px" }}
                                                        IconComponent={(props) => <ArrowDropDownIcon {...props} sx={{ fontSize: '1.2rem' }} />}
                                                    >
                                                        <MenuItem value="HIGH">
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <FiberManualRecordIcon sx={{ color: 'error.main', mr: 1, fontSize: '0.8rem' }} />
                                                                High
                                                            </Box>
                                                        </MenuItem>
                                                        <MenuItem value="MEDIUM">
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <FiberManualRecordIcon sx={{ color: 'warning.main', mr: 1, fontSize: '0.8rem' }} />
                                                                Medium
                                                            </Box>
                                                        </MenuItem>
                                                        <MenuItem value="LOW">
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <FiberManualRecordIcon sx={{ color: 'success.main', mr: 1, fontSize: '0.8rem' }} />
                                                                Low
                                                            </Box>
                                                        </MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="View Details">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenErrorModal(error)}
                                                        sx={{ color: '#457985' }}
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>

                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            {loading ? 'Loading...' : 'No error reports found'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Error Details Modal */}
                <Dialog 
                    open={openErrorModal} 
                    onClose={() => setOpenErrorModal(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        Error Details
                    </DialogTitle>
                    <DialogContent dividers>
                        {selectedError && (
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" color="textSecondary">Error ID</Typography>
                                        <Typography variant="body1" gutterBottom>{selectedError.id}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" color="textSecondary">Error Type</Typography>
                                        <Chip
                                            icon={errorTypeMapping[selectedError.errorType]?.icon || errorTypeMapping.other.icon}
                                            label={selectedError.errorType?.replace('_', ' ')}
                                            color={errorTypeMapping[selectedError.errorType]?.color || errorTypeMapping.other.color}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                                        <Chip
                                            label={selectedError.status}
                                            color={statusColorMapping[selectedError.status] || 'default'}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" color="textSecondary">Created At</Typography>
                                        <Typography variant="body1" gutterBottom>{formatDate(selectedError.createdAt)}</Typography>
                                    </Grid>
                                    {selectedError.updatedAt && (
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" color="textSecondary">Last Updated</Typography>
                                            <Typography variant="body1" gutterBottom>{formatDate(selectedError.updatedAt)}</Typography>
                                        </Grid>
                                    )}
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" color="textSecondary">Reported By</Typography>
                                        <Typography variant="body1" gutterBottom>{selectedError.reporter || 'System'}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="textSecondary">Item IDs</Typography>
                                        <Box sx={{ mt: 1 }}>
                                            {selectedError.itemIds?.map((id, index) => (
                                                <Chip 
                                                    key={index} 
                                                    label={id} 
                                                    size="small" 
                                                    sx={{ mr: 0.5, mb: 0.5 }} 
                                                />
                                            ))}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                                        <Paper variant="outlined" sx={{ p: 2, mt: 1, backgroundColor: '#f9f9f9' }}>
                                            <Typography variant="body1">
                                                {selectedError.description}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenErrorModal(false)}>Close</Button>
                        {selectedError && selectedError.status !== 'In Progress' && (
                            <Button 
                                variant="contained" 
                                color="info"
                                onClick={() => markAsInProgress(selectedError.id)}
                            >
                                Mark as In Progress
                            </Button>
                        )}
                        {selectedError && selectedError.status !== 'Resolved' && (
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={() => markAsResolved(selectedError.id)}
                            >
                                Mark as Resolved
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            </Box>

        {/* Users Section */}
        <Box ref={usersRef} sx={{ scrollMarginTop: '64px', mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            User Management
        </Typography>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Users List
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => window.location.href = '/register'}
                >
                Add user
                </Button>
            </Box>
            {userLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
            ) : userError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
                {userError}
            </Alert>
            ) : (
            <>
                <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Permissions</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {currentUsers.length > 0 ? (
                        currentUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ mr: 2, backgroundColor: '#1E88E5' }}>
                                {user.name.charAt(0)}
                                </Avatar>
                                {user.name}
                            </Box>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                            {user.permissions && user.permissions.length > 0 ? (
                                user.permissions.map((permission, index) => (
                                <Chip 
                                    key={index}
                                    label={permission} 
                                    color="primary"
                                    size="small"
                                    sx={{ mr: 0.5, mb: 0.5 }}
                                />
                                ))
                            ) : (
                                <Chip 
                                label="No permissions" 
                                variant="outlined"
                                size="small"
                                />
                            )}
                            </TableCell>
                            <TableCell>
                            <IconButton 
                                size="small" 
                                color="primary"
                                sx={{ mr: 1 }}
                                onClick={() => handleOpenEditModal(user)}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                                size="small" 
                                color="error"
                                sx={{ mr: 1 }}
                                onClick={() => handleOpenDeleteConfirmation(user)}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={5} align="center">
                            No users found
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Showing {users.length > 0 ? indexOfFirstUser + 1 : 0} - {Math.min(indexOfLastUser, users.length)} of {users.length} users
                </Typography>
                <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handleChangePage} 
                    color="primary" 
                />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ mr: 2 }}>
                    Export
                </Button>
                <Button 
                    variant="outlined" 
                    startIcon={<RefreshIcon />}
                    onClick={fetchUsers}
                >
                    Refresh
                </Button>
                </Box>
            </>
            )}
        </Paper>

        {/* Edit User Modal */}
        <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="sm" fullWidth>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
            {selectedUser && (
                <Box component="form" sx={{ mt: 2 }} noValidate>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                    disabled
                />
                <FormControl margin="normal" fullWidth>
                    <InputLabel>Permissions</InputLabel>
                    <Select
                    multiple
                    value={editFormData.permissions || []}
                    onChange={handlePermissionsChange}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} />
                        ))}
                        </Box>
                    )}
                    >
                    {availablePermissions.map((permission) => (
                        <MenuItem key={permission} value={permission}>
                        {permission}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Box>
            )}
            </DialogContent>
            <DialogActions>
            <Button onClick={handleCloseEditModal}>Cancel</Button>
            <Button onClick={handleSaveUser} color="primary" variant="contained">
                Save
            </Button>
            </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"Confirm User Deletion"}
            </DialogTitle>
            <DialogContent>
            <Typography variant="body1" id="alert-dialog-description">
                Are you sure you want to delete user {selectedUser?.name}? This action cannot be undone.
            </Typography>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                Cancel
            </Button>
            <Button onClick={handleDeleteUser} color="error" variant="contained" autoFocus>
                Delete
            </Button>
            </DialogActions>
        </Dialog>
        </Box>

        {/* W3C Analysis Section */}
        <Box ref={reportsRef} sx={{ scrollMarginTop: '64px', mb: 4 }}>
        <W3Canalysis></W3Canalysis>
        <div ></div>
        <W3CanalysisGraphs></W3CanalysisGraphs>
        <W3CanalysisGraphs2></W3CanalysisGraphs2>
        </Box>
        </Box>
    </Box>
        );
}


export default AdminDashboard;