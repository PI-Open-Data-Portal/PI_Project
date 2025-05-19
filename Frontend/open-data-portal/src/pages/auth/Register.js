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

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const logo = require('../../assets/logopng.png');
  const registerImage = require('../../assets/register.png');

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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      const response = await axios.post('http://localhost:8080/apiV1/auth/register', registerData);
      const { jwt, error } = response.data;
      
      if (error) {
        setError(error);
        return;
      }

      localStorage.setItem('token', jwt);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
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
        {/* Left side - Register Form */}
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
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '15px'
              }}
            >
              <Typography component="h1" variant="h5" sx={{ mb: 3, color: '#457884', fontWeight: 'bold' }}>
                Sign up
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={formData.name}
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
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
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
                  type={showPassword.password ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
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
                          onClick={() => handleTogglePassword('password')}
                          edge="end"
                          sx={{ color: '#457884' }}
                        >
                          {showPassword.password ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showPassword.confirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
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
                          onClick={() => handleTogglePassword('confirmPassword')}
                          edge="end"
                          sx={{ color: '#457884' }}
                        >
                          {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
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
                  {loading ? 'Signing up...' : 'Sign Up'}
                </Button>
                <Box sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#457884' }}>
                    Already have an account?
                  </Typography>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/login')}
                    sx={{
                      color: '#457884',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Sign In
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>

        {/* Right side - Image */}
        <Grid item xs={12} md={6} sx={{
          display: { xs: 'none', md: 'block' },
          backgroundImage: `url(${registerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
      </Grid>
    </>
  );
};

export default Register;
