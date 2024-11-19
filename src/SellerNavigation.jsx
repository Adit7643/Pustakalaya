import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material'; // Import Logout icon
import { Link, useNavigate } from "react-router-dom";

const SellerNavigation = ({ handleLogout }) => {
  const navigate = useNavigate(); 

  const handleLogoutClick = () => {
    handleLogout(); // Call the passed logout function
    navigate('/'); // Redirect to home or login page after logout
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Logo or Title */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: { xs: 1, md: 0 },
            textAlign: { xs: 'center', md: 'left' },
            display: { xs: 'flex', md: 'flex' },
            justifyContent: { xs: 'center', md: 'flex-start' },
          }}
        >
          Seller Dashboard
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link to="/sell">
            <Button sx={{ color: "white" }}>Dashboard</Button>
          </Link>
          <Link to="/orders">
            <Button sx={{ color: "white" }}>Your Orders</Button>
          </Link>
          <Link to="/list">
            <Button sx={{ color: "white" }}>List Book</Button>
          </Link>
        </Box>

        {/* Logout Button */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            onClick={handleLogoutClick}
            startIcon={<Logout />}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SellerNavigation;