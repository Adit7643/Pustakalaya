import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, InputBase, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tab, Tabs, ListItemIcon, ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';

import {
  AccountCircle,
  ShoppingCart,
  Search as SearchIcon,
  Google as GoogleIcon,
  MenuBook,
  Science,
  History,
  Computer,
  School,
  Brush,
  SportsSoccer,
  ChildFriendly,
  Psychology,
  Gavel,
  ExitToApp
} from '@mui/icons-material';
import { Avatar, Divider } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { firebaseConfig } from '../config';
import { doc, setDoc } from "firebase/firestore";


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const Navbar = () => {
  const [anchorElCategories, setAnchorElCategories] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [userName, setUserName] = useState("");

  const openCategories = Boolean(anchorElCategories);
  const openProfileMenu = Boolean(anchorElProfile);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserName(user.displayName || userName); // Set the username if logged in
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  const handleCategoriesClick = (event) => {
    setAnchorElCategories(event.currentTarget);
  };

  const handleCategoriesClose = () => {
    setAnchorElCategories(null);
  };

  const handleProfileClick = (event) => {
    if (!isLoggedIn) {
      setOpenLoginDialog(true);
    } else {
      setAnchorElProfile(event.currentTarget);
    }
  };

  const handleDialogClose = () => {
    setOpenLoginDialog(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };



  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "user", user.email), {
        name: user.displayName,
        email: user.email,
        password: `google_${user.email}`,
      });
      localStorage.setItem('user',user.email);
      setIsLoggedIn(true);
      handleDialogClose();
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };



  const handleSignUp = async () => {
    // Add your sign-up logic here (using createUserWithEmailAndPassword)
    const userDocRef = doc(db, "user", Email); // Use phone number as document ID
    await setDoc(userDocRef, {
      name: userName,
      email: Email,
      password: Password,
    });
    localStorage.setItem('user',Email);
    setIsLoggedIn(true);
    handleDialogClose();
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setAnchorElProfile(null); // Close profile menu
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              flexGrow: { xs: 1, md: 0 },
              textAlign: { xs: 'center', md: 'left' },
              display: { xs: 'flex', md: 'flex' },
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            Pustakalaya
          </Typography>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Link to="/">
              <Button sx={{ color: "white" }}>Home</Button>
            </Link>
            <Link to="/buy">
              <Button sx={{ color: "white" }}>Books</Button>
            </Link>

            {/* Categories Button */}
            <Button color="inherit" onClick={handleCategoriesClick}>
              Categories
            </Button>

            {/* Categories Menu with Icons */}
            <Menu
              anchorEl={anchorElCategories}
              open={openCategories}
              onClose={handleCategoriesClose}
              sx={{
                '& .MuiPaper-root': {
                  width: 'auto',
                  maxHeight: 300,
                  overflowY: 'auto',
                },
              }}
            >
              {/* List of categories with icons */}
              <MenuItem onClick={handleCategoriesClose}>
                <ListItemIcon><MenuBook /></ListItemIcon>
                <ListItemText primary="Literature & Fiction" />
              </MenuItem>
              <MenuItem onClick={handleCategoriesClose}>
                <ListItemIcon><Science /></ListItemIcon>
                <ListItemText primary="Science & Technology" />
              </MenuItem>
              <MenuItem onClick={handleCategoriesClose}>
                <ListItemIcon><History /></ListItemIcon>
                <ListItemText primary="History & Geography" />
              </MenuItem>
              <MenuItem onClick={handleCategoriesClose}>
                <ListItemIcon><Computer /></ListItemIcon>
                <ListItemText primary="Computers & IT" />
              </MenuItem>
              <MenuItem onClick={handleCategoriesClose}>
                <ListItemIcon><School /></ListItemIcon>
                <ListItemText primary="Educational" />
              </MenuItem>
              <MenuItem onClick={handleCategoriesClose}>
                <ListItemIcon><Brush /></ListItemIcon>
                <ListItemText primary="Arts & Crafts" />
              </MenuItem>
              <MenuItem onClick={handleCategoriesClose}>
                <ListItemIcon><SportsSoccer /></ListItemIcon>
                <ListItemText primary="Sports" />
              </MenuItem>
              <MenuItem onClick={handleCategoriesClose}>
                <ListItemIcon><ChildFriendly /></ListItemIcon>
                <ListItemText primary="Children & Teen" />
              </MenuItem>
              <MenuItem onClick={handleCategoriesClose}>
                <ListItemIcon><Psychology /></ListItemIcon>
                <ListItemText primary="Psychology & Self-Help" />
              </MenuItem>
              <MenuItem onClick={handleCategoriesClose}>
                <ListItemIcon><Gavel /></ListItemIcon>
                <ListItemText primary="Law & Government" />
              </MenuItem>
            </Menu>
            <Link to="/sell">
              <Button sx={{ color: "white" }}>Sell</Button>
            </Link>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: { xs: 1, md: 0 },
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 1,
                px: 2,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <SearchIcon />
              <InputBase
                placeholder="Search..."
                sx={{
                  color: 'inherit',
                  ml: 1,
                  width: { xs: '100%', sm: '200px', md: '250px' },
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconButton color="inherit" onClick={handleProfileClick}>
              <AccountCircle />
            </IconButton>
            <Link to="/cart">
              <IconButton sx={{ color: 'white' }}>
                <ShoppingCart />
              </IconButton>
            </Link>

          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorElProfile}
        open={openProfileMenu}
        onClose={() => setAnchorElProfile(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            maxWidth: '300px', // Set a max width to prevent overflow
            overflow: 'auto', // Prevents overflow if content is too long
          },
        }}
        sx={{
          '& .MuiPaper-root': {
            mt: 1, // Adjust top margin to prevent overflow
          },
        }}
      >
        {isLoggedIn ? [
          // Avatar Section
          <MenuItem disabled key="avatar">
            <Avatar sx={{ width: 32, height: 32, marginRight: 1 }} alt={userName} src="/path/to/avatar.jpg" />
            <ListItemText primary={userName} />
          </MenuItem>,
          <Divider key="divider" />,

          // Menu Items
          <MenuItem onClick={() => { /* Handle My Orders */ }} key="my-orders">
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="My Orders" />
          </MenuItem>,

          <MenuItem onClick={() => { /* Handle My Profile */ }} key="my-profile">
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="My Profile" />
          </MenuItem>,

          <MenuItem onClick={() => { /* Handle Saved Addresses */ }} key="saved-addresses">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Saved Addresses" />
          </MenuItem>,

          <MenuItem onClick={() => { /* Handle Wish List */ }} key="wish-list">
            <ListItemIcon>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="Wish List" />
          </MenuItem>,

          <MenuItem onClick={handleLogout} key="logout">
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        ] : (
          <MenuItem onClick={handleProfileClick} key="login-signup">
            <ListItemText primary="Login / Sign Up" />
          </MenuItem>
        )}
      </Menu>


      {/* Login Dialog */}
      <Dialog open={openLoginDialog} onClose={handleDialogClose}>
        <DialogTitle>Login / Sign Up</DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="login-signup tabs">
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>
          {activeTab === 0 ? (
            <>
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                fullWidth
                margin="normal"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button variant="contained" color="primary" fullWidth >
                Login
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 2,
                  cursor: 'pointer',
                }}
                onClick={handleGoogleSignIn}
              >
                <GoogleIcon color="secondary" sx={{ fontSize: 40 }} />
                <Typography sx={{ ml: 1 }}>Continue with Google</Typography>
              </Box>
            </>
          ) : (
            <Box>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
