import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Dialog, Tab, Tabs, Box, Typography, Button, TextField, ListItemIcon, Divider } from '@mui/material';
import { AccountCircle, ShoppingCart, Favorite, Settings, ExitToApp, ListAlt, Home } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import { Link } from 'react-router-dom';

const ProfileTab = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [tabIndex, setTabIndex] = useState(0); // State for tab switching between login/signup

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);

    // If user is not logged in, show the login dialog
    if (!isLoggedIn) {
      setOpenLoginDialog(true);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClose = () => {
    setOpenLoginDialog(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleLogin = () => {
    setIsLoggedIn(true); // Simulating login; replace with actual login logic
    setOpenLoginDialog(false); // Close login dialog after login
  };

  return (
    <>
      {/* Profile Icon */}
      <IconButton color="inherit" onClick={handleMenuOpen}>
        <AccountCircle />
      </IconButton>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl && isLoggedIn)} // Only open the menu if the user is logged in
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 2,
            mr: 2, // Right margin to add gap between the icon and the menu
            minWidth: 200,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: 1,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {isLoggedIn ? (
          <>
            <MenuItem
              onClick={handleMenuClose}
              sx={{
                px: 2,
                py: 1,
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <ListItemIcon>
                <ListAlt fontSize="small" />
              </ListItemIcon>
              My Orders
            </MenuItem>

            <MenuItem
              onClick={handleMenuClose}
              sx={{
                px: 2,
                py: 1,
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <ListItemIcon>
                <Favorite fontSize="small" />
              </ListItemIcon>
              My Favorites
            </MenuItem>
            <Link to="/profile">
            <MenuItem
              onClick={handleMenuClose}
              sx={{
                px: 2,
                py: 1,
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>
            </Link>

            <MenuItem
              onClick={handleMenuClose}
              sx={{
                px: 2,
                py: 1,
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <ListItemIcon>
                <Home fontSize="small" />
              </ListItemIcon>
              Saved Addresses
            </MenuItem>

            <Divider sx={{ my: 1 }} /> {/* Divider for visual separation */}

            <MenuItem
              onClick={handleMenuClose}
              sx={{
                px: 2,
                py: 1,
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>

            <MenuItem
              onClick={handleMenuClose}
              sx={{
                px: 2,
                py: 1,
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <ListItemIcon>
                <ExitToApp fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </>
        ) : null}
      </Menu>

      {/* Login Dialog */}
      <Dialog open={openLoginDialog} onClose={handleLoginClose} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          {/* Tabs for Login/Signup */}
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Signup" />
          </Tabs>

          {/* Login Tab */}
          {tabIndex === 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Login to your account
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                label="Phone Number"
                type="tel"
                sx={{ mb: 2 }}
              />
              <Button fullWidth variant="contained" color="primary" onClick={handleLogin}>
                Login with Phone Number
              </Button>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Or login with
                </Typography>
                <Button
                  fullWidth
                  startIcon={<GoogleIcon />}
                  variant="outlined"
                  color="primary"
                  onClick={handleLogin}
                >
                  Login with Google
                </Button>
              </Box>
            </Box>
          )}

          {/* Signup Tab */}
          {tabIndex === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Create a new account
              </Typography>
              <TextField fullWidth variant="outlined" label="Name" sx={{ mb: 2 }} />
              <TextField fullWidth variant="outlined" label="Phone Number" type="tel" sx={{ mb: 2 }} />
              <Button fullWidth variant="contained" color="primary">
                Signup
              </Button>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Or signup with
                </Typography>
                <Button
                  fullWidth
                  startIcon={<GoogleIcon />}
                  variant="outlined"
                  color="primary"
                >
                  Signup with Google
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default ProfileTab;
