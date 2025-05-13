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
  Tooltip
} from '@mui/material';


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

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const drawerWidth = 240;

const errorReports = [
    { id: 1, description: 'Numeric Error', table: 'Ship Details', row: 12, severity: 'High', status: 'Unresolved', reporter: 'John Doe', dateReported: '05/10/2025', detailedDescription: 'Numeric value in row 12 of Ship Details table is outside of acceptable range parameters. The system expected a value between 0-1000, but received 1500.' },
    { id: 2, description: 'Invalid Format', table: 'Ship Details', row: 45, severity: 'Medium', status: 'Resolved', reporter: 'John Doe', dateReported: '05/08/2025', detailedDescription: 'Date format in row 45 is incorrect. Expected format is DD/MM/YYYY but received MM-DD-YYYY.' },
    { id: 3, description: 'Invalid Format', table: 'Container Details', row: 23, severity: 'Low', status: 'Unresolved', reporter: 'John Doe', dateReported: '05/11/2025', detailedDescription: 'Container ID in row 23 does not match the expected format pattern. Expected: CONT-XXXXX, Received: CT-12345.' },
    { id: 4, description: 'Invalid Format', table: 'Container Details', row: 12, severity: 'High', status: 'Unresolved', reporter: 'John Doe', dateReported: '05/09/2025', detailedDescription: 'Value in weight field in row 12 contains non-numeric characters. Expected: numeric value, Received: "12.5kg".' },
    { id: 5, description: 'Numeric Error', table: 'Ship Details', row: 45, severity: 'Medium', status: 'Resolved', reporter: 'John Doe', dateReported: '05/07/2025', detailedDescription: 'Calculated values in row 45 do not match expected results. Volume calculation is incorrect based on provided dimensions.' },
    { id: 6, description: 'Invalid Format', table: 'Container Details', row: 23, severity: 'Low', status: 'Unresolved', reporter: 'John Doe', dateReported: '05/10/2025', detailedDescription: 'Missing required field in row 23. Destination port field is empty but is required for processing.' },
  ];

// Dados de exemplo para os cards
const cardData = [
  { title: 'Users', value: '2,567', icon: <PersonIcon sx={{ fontSize: 40, color: '#FF9800' }} /> },
  { title: 'Admins', value: '48', icon: <AdminPanelSettingsIcon sx={{ fontSize: 40, color: '#2196F3' }} /> },
  { title: 'Tables', value: '156', icon: <TableChartIcon sx={{ fontSize: 40, color: '#4CAF50' }} /> },
  { title: 'Databases', value: '12', icon: <StorageIcon sx={{ fontSize: 40, color: '#9C27B0' }} /> },
  { title: 'Reports', value: '783', icon: <CommentIcon sx={{ fontSize: 40, color: '#E91E63' }} /> },
  { title: 'Downloads', value: '1,568', icon: <DownloadIcon sx={{ fontSize: 40, color: '#F44336' }} /> },
];

const data1 = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4000 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 7000 },
    ];

    const data2 = [
    { name: 'Jan', access: 2000 },
    { name: 'Feb', access: 4000 },
    { name: 'Mar', access: 3000 },
    { name: 'Apr', access: 5000 },
    { name: 'May', access: 6000 },
    { name: 'Jun', access: 8000 },
    ];


// Dados de exemplo para a tabela de usuários (mais usuários para paginação)
const allUserData = [
  { id: 1, name: 'João Silva', email: 'joao.silva@email.com', role: 'Admin', status: 'Ativo', lastLogin: '10/03/2025' },
  { id: 2, name: 'Maria Santos', email: 'maria.santos@email.com', role: 'Editor', status: 'Ativo', lastLogin: '15/03/2025' },
  { id: 3, name: 'Pedro Oliveira', email: 'pedro.oliveira@email.com', role: 'Usuário', status: 'Inativo', lastLogin: '01/02/2025' },
  { id: 4, name: 'Ana Costa', email: 'ana.costa@email.com', role: 'Editor', status: 'Ativo', lastLogin: '18/03/2025' },
  { id: 5, name: 'Lucas Ferreira', email: 'lucas.ferreira@email.com', role: 'Usuário', status: 'Ativo', lastLogin: '16/03/2025' },
  { id: 6, name: 'Juliana Mendes', email: 'juliana.mendes@email.com', role: 'Admin', status: 'Ativo', lastLogin: '19/03/2025' },
  { id: 7, name: 'Roberto Alves', email: 'roberto.alves@email.com', role: 'Admin', status: 'Ativo', lastLogin: '14/03/2025' },
  { id: 8, name: 'Carla Gomes', email: 'carla.gomes@email.com', role: 'Editor', status: 'Ativo', lastLogin: '17/03/2025' },
  { id: 9, name: 'Fernando Lima', email: 'fernando.lima@email.com', role: 'Usuário', status: 'Inativo', lastLogin: '05/03/2025' },
  { id: 10, name: 'Patrícia Rocha', email: 'patricia.rocha@email.com', role: 'Usuário', status: 'Ativo', lastLogin: '12/03/2025' },
  { id: 11, name: 'Marcos Souza', email: 'marcos.souza@email.com', role: 'Editor', status: 'Ativo', lastLogin: '11/03/2025' },
  { id: 12, name: 'Daniela Castro', email: 'daniela.castro@email.com', role: 'Admin', status: 'Inativo', lastLogin: '08/03/2025' },
  { id: 13, name: 'Bruno Martins', email: 'bruno.martins@email.com', role: 'Usuário', status: 'Ativo', lastLogin: '13/03/2025' },
  { id: 14, name: 'Laura Pereira', email: 'laura.pereira@email.com', role: 'Editor', status: 'Ativo', lastLogin: '15/03/2025' },
  { id: 15, name: 'Rafael Moreira', email: 'rafael.moreira@email.com', role: 'Usuário', status: 'Ativo', lastLogin: '09/03/2025' },
  { id: 16, name: 'Amanda Barros', email: 'amanda.barros@email.com', role: 'Admin', status: 'Ativo', lastLogin: '19/03/2025' },
  { id: 17, name: 'Gabriel Nascimento', email: 'gabriel.nascimento@email.com', role: 'Usuário', status: 'Inativo', lastLogin: '07/03/2025' },
  { id: 18, name: 'Camila Ribeiro', email: 'camila.ribeiro@email.com', role: 'Editor', status: 'Ativo', lastLogin: '16/03/2025' },
];

const systemStatusData = [
    { title: 'Main Server', status: 'Online', uptime: '99.9%', icon: <CheckCircleIcon sx={{ color: '#4CAF50' }} /> },
    { title: 'Database', status: 'Online', uptime: '99.7%', icon: <CheckCircleIcon sx={{ color: '#4CAF50' }} /> },
    { title: 'API Gateway', status: 'Warning', uptime: '97.5%', icon: <WarningIcon sx={{ color: '#FF9800' }} /> },
    { title: 'Backup Server', status: 'Offline', uptime: '0%', icon: <ErrorIcon sx={{ color: '#F44336' }} /> },
  ];
  
const recentStats = [
    { title: 'New Users', value: '+12%', isUp: true, period: 'Last 7 days' },
    { title: 'Average Session Time', value: '24min', isUp: true, period: 'Last 30 days' },
    { title: 'Bounce Rate', value: '-3%', isUp: false, period: 'Last 30 days' },
    { title: 'Total Traffic', value: '+8%', isUp: true, period: 'Last 30 days' },
];
  
const recentTasks = [
    { title: 'System Update', completed: 75, deadline: '03/25/2025', priority: 'High' },
    { title: 'Database Backup', completed: 100, deadline: '03/20/2025', priority: 'High' },
    { title: 'Security Review', completed: 30, deadline: '04/01/2025', priority: 'Medium' },
    { title: 'Data Migration', completed: 10, deadline: '04/15/2025', priority: 'Low' },
  ];
  
const reportsData = [
    { title: 'Sales Report', date: '03/15/2025', downloads: 324, status: 'Completed' },
    { title: 'Performance Analysis', date: '03/12/2025', downloads: 156, status: 'Completed' },
    { title: 'User Metrics', date: '03/18/2025', downloads: 212, status: 'In Progress' },
    { title: 'System Audit', date: '03/10/2025', downloads: 89, status: 'Completed' },
  ];
  
const systemTables = [
    { name: 'ships', records: '2,567', lastUpdate: '03/19/2025', size: '45 MB', status: 'Optimized' },
    { name: 'containers', records: '8,423', lastUpdate: '03/18/2025', size: '120 MB', status: 'Optimized' },
    { name: 'orders', records: '15,892', lastUpdate: '03/19/2025', size: '230 MB', status: 'Requires Indexing' },
    { name: 'users', records: '12,456', lastUpdate: '03/17/2025', size: '180 MB', status: 'Optimized' },
    { name: 'logs', records: '458,921', lastUpdate: '03/19/2025', size: '1.2 GB', status: 'Requires Cleanup' },
  ];
  
function AdminDashboard() {
    const [filteredReports, setFilteredReports] = useState(errorReports);
    const [searchTable, setSearchTable] = useState('');
    const [searchAnalyst, setSearchAnalyst] = useState('');
    const [severityFilter, setSeverityFilter] = useState('all');
    const [openErrorModal, setOpenErrorModal] = useState(false);
    const [selectedError, setSelectedError] = useState(null);

    // Function to handle opening the error modal
    const handleOpenErrorModal = (error) => {
        setSelectedError(error);
        setOpenErrorModal(true);
    };

    // Função para converter severidade em valores numéricos
    const getSeverityValue = (severity) => {
        switch (severity) {
            case 'High': return 100;
            case 'Medium': return 50;
            case 'Low': return 10;
            default: return 0;
        }
    };

    // Função para filtrar os erros com base nos critérios
    const handleFilterChange = () => {
        const filtered = errorReports.filter(report => {
            return (
                (searchTable === '' || report.table.toLowerCase().includes(searchTable.toLowerCase())) &&
                (searchAnalyst === '' || (report.reporter && report.reporter.toLowerCase().includes(searchAnalyst.toLowerCase()))) &&
                (severityFilter === 'all' || report.severity.toLowerCase() === severityFilter.toLowerCase())
            );
        });
        setFilteredReports(filtered);
    };

    // useEffect para garantir que o filtro seja aplicado sempre que os campos de pesquisa ou o slider mudarem
    useEffect(() => {
        handleFilterChange();
    }, [searchTable, searchAnalyst, severityFilter]);

    const [open, setOpen] = React.useState(true);
    const [page, setPage] = React.useState(1);
    const usersPerPage = 6;

    // Refs para scroll
    const statusRef = useRef(null);
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

    // Cálculo para paginação
    const indexOfLastUser = page * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = allUserData.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(allUserData.length / usersPerPage);

    return (
        <Box sx={{ display: 'flex' }}>
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
                        <ListItem button onClick={() => scrollToSection(statusRef)} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                            <ListItemIcon sx={{ color: '#ffffff' }}>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Status" />
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
                        <ListItem button onClick={() => scrollToSection(tablesRef)} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                            <ListItemIcon sx={{ color: '#ffffff' }}>
                                <TableChartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Tables" />
                        </ListItem>
                        <ListItem button onClick={() => scrollToSection(chartsRef)} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                            <ListItemIcon sx={{ color: '#ffffff' }}>
                                <BarChartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Charts" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            {/* Main content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
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

                {/* Status Section */}
                <Box ref={statusRef} sx={{ scrollMarginTop: '64px' }}>
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                        System Status
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {/* System Status */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        System Problems
                                    </Typography>
                                    <IconButton>
                                        <MoreVertIcon />
                                    </IconButton>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <List>
                                    {systemStatusData.map((item, index) => (
                                        <ListItem key={index} sx={{ px: 0 }}>
                                            <ListItemIcon>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.title}
                                                secondary={`Uptime: ${item.uptime}`}
                                            />
                                            <Chip
                                                label={item.status}
                                                color={
                                                    item.status === 'Online' ? 'success' :
                                                        item.status === 'Warning' ? 'warning' : 'error'
                                                }
                                                size="small"
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Button variant="text" sx={{ mt: 2 }}>
                                    Full details &rarr;
                                </Button>
                            </Paper>
                        </Grid>

                        {/* Recent Stats */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                                    Recent Status
                                </Typography>
                                <Grid container spacing={2}>
                                    {recentStats.map((stat, index) => (
                                        <Grid item xs={12} sm={6} key={index}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="h6" component="div">
                                                            {stat.title}
                                                        </Typography>
                                                        {stat.isUp ?
                                                            <TrendingUpIcon sx={{ color: '#4CAF50' }} /> :
                                                            <TrendingDownIcon sx={{ color: '#F44336' }} />
                                                        }
                                                    </Box>
                                                    <Typography variant="h4" sx={{ my: 1 }}>
                                                        {stat.value}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                        {stat.period}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* Error Reports Section */}
                <Box ref={reportsRef} sx={{ scrollMarginTop: '64px', mb: 4 }}>
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Error Reports
                    </Typography>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Total Errors: {filteredReports.length}</Typography>
                            <Button variant="contained" startIcon={<FileDownloadIcon />} size="small">
                                Download Reports
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Error Description</TableCell>
                                        <TableCell>Table Name</TableCell>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Severity</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Reporter</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredReports.map((error) => (
                                        <TableRow key={error.id}>
                                            <TableCell>{error.description}</TableCell>
                                            <TableCell>{error.table}</TableCell>
                                            <TableCell>{error.row}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={error.severity}
                                                    color={
                                                        error.severity === 'High' ? 'error' :
                                                            error.severity === 'Medium' ? 'warning' : 'info'
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={error.status}
                                                    color={error.status === 'Resolved' ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{error.reporter}</TableCell>
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
                                    ))}
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
                  <Typography variant="body1" gutterBottom>{selectedError.row}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Table</Typography>
                  <Typography variant="body1" gutterBottom>{selectedError.table}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Reported By</Typography>
                  <Typography variant="body1" gutterBottom>{selectedError.reporter}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Date Reported</Typography>
                  <Typography variant="body1" gutterBottom>{selectedError.dateReported}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Severity</Typography>
                  <Chip
                    label={selectedError.severity}
                    color={
                      selectedError.severity === 'High' ? 'error' :
                      selectedError.severity === 'Medium' ? 'warning' : 'info'
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Chip
                    label={selectedError.status}
                    color={selectedError.status === 'Resolved' ? 'success' : 'warning'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Brief Description</Typography>
                  <Typography variant="body1" paragraph>
                    {selectedError.description}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Detailed Description</Typography>
                  <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                    <Typography variant="body1">
                      {selectedError.detailedDescription}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorModal(false)}>Close</Button>
          {selectedError && selectedError.status !== 'Resolved' && (
            <Button variant="contained" color="primary">
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
              <Button variant="contained" color="primary">
                Add user
              </Button>
            </Box>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nanme</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Function</TableCell>
                    <TableCell>Stats</TableCell>
                    <TableCell>Last Login</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentUsers.map((user) => (
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
                        <Chip 
                          label={user.role} 
                          color={user.role === 'Admin' ? 'primary' : user.role === 'Editor' ? 'secondary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.status} 
                          color={user.status === 'Ativo' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Showing {indexOfFirstUser + 1} - {Math.min(indexOfLastUser, allUserData.length)} : {allUserData.length} users
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
              <Button variant="outlined">See All</Button>
            </Box>
          </Paper>
        </Box>

        {/* Tables Section */}
        <Box ref={tablesRef} sx={{ scrollMarginTop: '64px', mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            System Tables
          </Typography>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Tables Management
              </Typography>
              <Button variant="contained" color="primary">
                New Table
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Registers</TableCell>
                    <TableCell>Last Atualization</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {systemTables.map((table, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StorageIcon sx={{ mr: 1, color: '#1976D2' }} />
                          {table.name}
                        </Box>
                      </TableCell>
                      <TableCell>{table.records}</TableCell>
                        <TableCell>{table.lastUpdate}</TableCell>
                        <TableCell>{table.size}</TableCell>
                        <TableCell>
                          <Chip 
                            label={table.status} 
                            color={table.status === 'Otimizado' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" size="small">
                            Details
                          </Button>
                        </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ mr: 2 }}>
                Exportar
              </Button>
              <Button variant="outlined">Ver Todas</Button>
            </Box>
            </Paper>
        </Box>

        {/* Charts Section */}
        <Box ref={chartsRef} sx={{ scrollMarginTop: '64px' }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Data Charts
        </Typography>
        <Grid container spacing={3}>
            {/* Chart 1 - Gráfico de Vendas */}
            <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Sales Chart
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data1}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="vendas" stroke="#8884d8" />
                </LineChart>
                </ResponsiveContainer>
            </Paper>
            </Grid>

            {/* Chart 2 - Gráfico de Acessos */}
            <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Access Chart
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data2}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="acessos" stroke="#82ca9d" />
                </LineChart>
                </ResponsiveContainer>
            </Paper>
            </Grid>
        </Grid>
        </Box>
        </Box>
    </Box>
        );
}


export default AdminDashboard;