import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  AppBar,
  Toolbar,
  Grid
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const logo = require('../../assets/logopng.png');
  const loginImage = require('../../assets/login.png');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:8080/apiV1/auth/login', formData);
      const { jwt, error } = response.data;
      
      if (error) {
        setError(error);
        return;
      }

      localStorage.setItem('token', jwt);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <>
      <AppBar position="absolute" sx={{ background: "transparent", boxShadow: "none", p: 2 }}>
        <Toolbar>
          <Button
            onClick={() => navigate("/")}
            startIcon={<ArrowBack />}
            sx={{
              color: '#457884',
              '&:hover': {
                backgroundColor: 'rgba(69, 120, 132, 0.08)'
              }
            }}
          >
            Back to Home
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container sx={{ minHeight: '100vh' }}>
        {/* Left side - Image */}
        <Grid item xs={12} md={6} sx={{
          display: { xs: 'none', md: 'block' },
          backgroundImage: `url(${loginImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        
        {/* Right side - Login Form */}
        <Grid item xs={12} md={6} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}>
          <Box sx={{ width: '100%', maxWidth: '400px' }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <img src={logo} alt="Logo" style={{ width: '200px' }} />
            </Box>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '15px'
              }}
            >
              <Typography component="h1" variant="h5" sx={{ mb: 3, color: '#457884', fontWeight: 'bold' }}>
                Sign in
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#457884',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#457884',
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#457884',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#457884',
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePassword}
                          edge="end"
                          sx={{ color: '#457884' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {error && (
                  <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                    {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    background: '#457884',
                    borderRadius: '20px',
                    padding: '10px',
                    '&:hover': {
                      backgroundColor: '#375f58',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#457884',
                      opacity: 0.7,
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
                <Box sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#457884' }}>
                    Don't have an account?
                  </Typography>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/register')}
                    sx={{
                      color: '#457884',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Sign Up
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
