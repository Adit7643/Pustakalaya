import React, { useState, useEffect } from 'react';
import RecentOrdersCard from './RecentOrdersCard';
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  MenuItem,
  Chip,
  useTheme
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SellerNavigation from './SellerNavigation';
import MostSellingBooks from './MostSellingBooks';
import MonthlyEarningsChart from './MonthlyEarningsChart';
import { Link } from 'react-router-dom';
import MapComponent from './MapComponent';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config';
import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import Footer from './Footer';
import SellerDetailsCard from './SellerDetailsCard';
import Google from "./assets/google-icon.jpg";
// Dummy data for earnings, orders, and transactions
const totalEarningsTarget = 100000;

// Categories for genre selection
const genres = [
  "Literature & Fiction",
  "Science & Technology",
  "History & Geography",
  "Computers & IT",
  "Educational",
  "Arts & Crafts",
  "Sports",
  "Children & Teen",
  "Psychology & Self-Help",
  "Law & Government",
];

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// Custom Circular Progress with center label


const SellerDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(!isLoggedIn);
  const [userName, setUserName] = useState("");
  const [address, setAddress] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState([]); // State for selected genres
  const [formData, setFormData] = useState({
    enterpriseName: "",
    revenue: "",
    email: "",
    password: "",
    category: "",
    sellerName: "",
    warehouseLocation: "",
    Gst_Number: "",
    MonthlyEarnings: []
  });

  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [totalEarnings, settotalEarnings] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Check for logged-in user from local storage
        const user = JSON.parse(localStorage.getItem('seller_user'));
        if (user) {
          setIsLoggedIn(true);
          setUserName(user.displayName);
        }

        // Monitor authentication state changes
        onAuthStateChanged(auth, (authUser) => {
          if (authUser) {
            setUserName(authUser.displayName || userName); // Update username if logged in
          } else {
            setIsLoggedIn(false);
          }
        });

        // Fetch monthly earnings for the seller
        const sellerEmail = localStorage.getItem('seller');
        if (sellerEmail) {
          const orderDocRef = doc(db, 'sellers', sellerEmail);
          const sellerDocSnap = await getDoc(orderDocRef);

          if (sellerDocSnap.exists()) {
            const monthlyEarnings = sellerDocSnap.data().monthly_earnings || Array(12).fill(0);
            setMonthlyEarnings(monthlyEarnings);
            const pending = sellerDocSnap.data().pending || 0;
            setPendingOrders(pending);
            const sum = monthlyEarnings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            settotalEarnings(sum);
          } else {
            console.warn("Seller document does not exist.");
          }
        } else {
          console.warn("No seller email found in local storage.");
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData(); // Call the asynchronous function
  }, []);


  const handleProfileClick = () => {
    if (!localStorage.getItem('seller_user')) {
      setOpenLoginDialog(true);
    }
  };

  const handleLogin = async () => {
    const email = formData.email;
    const password = formData.password;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem('seller', formData.email);
        localStorage.setItem('seller_user', JSON.stringify(user));
        setIsLoggedIn(true);
        setOpenLoginDialog(false);
        console.log(user);

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });

  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user.email);

      await setDoc(
        doc(db, "sellers", user.email),
        {
          name: user.displayName,
          email: user.email,
          password: `google_${user.email}`,
        },
        { merge: true } // Correct syntax for the merge option
      );

      localStorage.setItem('seller', user.email);
      console.log(localStorage.getItem('seller'));
      console.log("after Sign in");
      localStorage.setItem('seller_user', JSON.stringify(user));
      setIsLoggedIn(true);
      handleDialogClose();
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  }


  const handleAddressChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      warehouseLocation: sessionStorage.getItem("address"),
    }));
  };

  const handleDialogClose = () => {
    setOpenLoginDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSignUp = async () => {
    const { email, password } = formData;
    try {
      // Validate input fields
      if (!email || !password) {
        alert("Please fill in all required fields");
        return;
      }
  
      // Additional form validation
      if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
      }
  
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Reference to Firestore document and set seller data
      const docRef = doc(db, "sellers", email);
      await setDoc(docRef, {
        ...formData,
        genres: selectedGenres,
        createdAt: new Date(),
        userId: user.uid
      }, { merge: true });
  
      // Save email to local storage and update state
      localStorage.setItem('seller', email);
      localStorage.setItem('seller_user', JSON.stringify(user));
      
      setIsLoggedIn(true);
      setOpenLoginDialog(false);
      
      console.log("Seller added successfully!");
    } catch (error) {
      // Comprehensive error handling
      switch (error.code) {
        case 'auth/email-already-in-use':
          alert("Email is already registered. Please use a different email or try logging in.");
          break;
        case 'auth/invalid-email':
          alert("Invalid email address. Please check and try again.");
          break;
        case 'auth/weak-password':
          alert("Password is too weak. Please choose a stronger password.");
          break;
        default:
          console.error("Signup Error:", error);
          alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('seller_user'); // Clear the seller name from local storage
    setIsLoggedIn(false); // Update the logged-in state
    setUserName(""); // Clear the username
  };


  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre); // Remove genre if already selected
      } else {
        return [...prev, genre]; // Add genre if not selected
      }
    });
  };
  console.log(address);
  const earningsProgress = (totalEarnings / totalEarningsTarget) * 100;

  return (
    <>
      {isLoggedIn ? (
        <div>
          <SellerNavigation handleLogout={handleLogout} />

          <Box sx={{ paddingLeft: 10, paddingRight: 10, paddingTop: 4 }}>
            <Grid container spacing={3} sx={{display:"flex", alignItems:"center"}}>
              <Grid item lg={8} xs={12} md={4}>

                <MonthlyEarningsChart
                  earningsData={monthlyEarnings}
                  sx={{
                    width: '100%',
                    maxWidth: '100%',
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <SellerDetailsCard />
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                    borderRadius: 3,
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Total Earnings
                      </Typography>
                      <Chip
                        label={`Target: ₹${totalEarningsTarget.toLocaleString()}`}
                        color="success"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>

                    <Box
                      sx={{
                        position: 'relative',
                        width: 180,
                        height: 180,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 2
                      }}
                    >
                      <CircularProgress
                        variant="determinate"
                        value={earningsProgress}
                        size={180}
                        thickness={6}
                        sx={{
                          color: 'primary.light',
                          position: 'absolute',
                          zIndex: 1,
                        }}
                      />
                      <CircularProgress
                        variant="determinate"
                        value={100}
                        size={170}
                        thickness={4}
                        sx={{
                          color: 'grey.300',
                          position: 'absolute',
                          zIndex: 0,
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          zIndex: 2,
                        }}
                      >
                        <Typography
                          variant="h4"
                          color="primary"
                          sx={{ fontWeight: 'bold' }}
                        >
                          ₹{totalEarnings.toLocaleString()}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {`${Math.round(earningsProgress)}% of Target`}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textAlign: 'center',
                        maxWidth: 250,
                        opacity: 0.7
                      }}
                    >
                      Your total earnings this year, tracking towards the annual target
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                    borderRadius: 3,
                    padding: '16px',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Pending Orders
                      </Typography>
                      <Chip
                        label={`Total: ${pendingOrders}`}
                        color="warning"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%'
                      }}
                    >
                      <ShoppingCartIcon
                        sx={{
                          fontSize: 80,
                          color: 'primary.main',
                          mb: 2
                        }}
                      />
                      <Typography
                        variant="h4"
                        color="error"
                        sx={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          mb: 2
                        }}
                      >
                        {pendingOrders}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          textAlign: 'center',
                          mb: 2
                        }}
                      >
                        Orders Waiting to be Processed
                      </Typography>
                      <Link to="/orders">
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            textTransform: 'none',
                            borderRadius: 2
                          }}
                        >
                          View Pending Orders
                        </Button>
                      </Link>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <RecentOrdersCard sellerEmail={localStorage.getItem('seller')} />
              </Grid>
            </Grid>

            <MostSellingBooks />
          </Box>
        </div>
      ) : (
        <Dialog open={openLoginDialog} onClose={handleDialogClose}>
          <DialogTitle>{activeTab === 0 ? 'Login' : 'Sign Up'}</DialogTitle>
          <DialogContent>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Login" />
              <Tab label="Sign Up" />
            </Tabs>
            <Box sx={{ mt: 2 }}>
              {activeTab === 0 ? (
                <>
                  <TextField label="Email" fullWidth margin="normal" name="email" value={formData.email} onChange={handleChange} />
                  <TextField label="Password" fullWidth margin="normal" name="password" value={formData.password} onChange={handleChange} />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, textTransform: 'none' }}
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1, textTransform: 'none' }}
                    startIcon={<img src={Google} alt="Google" style={{ width: 20 }} />}
                    onClick={handleGoogleSignIn}
                  >
                    Login with Google
                  </Button>
                </>
              ) : (
                <>
                  <TextField label="Name of Enterprise" fullWidth margin="normal" name="enterpriseName" value={formData.enterpriseName} onChange={handleChange} />
                  <TextField label="Annual Revenue" fullWidth margin="normal" name="revenue" value={formData.revenue} onChange={handleChange} />
                  <TextField label="Email" fullWidth margin="normal" name="email" value={formData.email} onChange={handleChange} />
                  <TextField label="Password" fullWidth margin="normal" name="password" value={formData.password} onChange={handleChange} />
                  <TextField label="GST Number" fullWidth margin="normal" name="Gst_Number" value={formData.Gst_Number} onChange={handleChange} />
                  <TextField label="Seller Name" fullWidth margin="normal" name="sellerName" value={formData.sellerName} onChange={handleChange} />
                  <Box sx={{ display: "flex", justifyContent: "center" }} onClick={handleAddressChange}>
                    <TextField label="Warehouse Location" name="warehouseLocation" value={formData.warehouseLocation} onChange={handleChange}
                      multiline
                      rowsmin={3} // Minimum number of rows
                      maxRows={6} />

                    <Box sx={{ flex: 1, height: "17rem", borderRadius: 1, overflow: 'hidden' }} onClick={handleAddressChange}>
                      <MapComponent onClick={{ handleAddressChange }} />
                    </Box>
                  </Box>

                  <TextField
                    select
                    label="Select Genres"
                    fullWidth
                    margin="normal"
                    value=""
                  >
                    {genres.map((genre) => (
                      <MenuItem key={genre} value={genre} onClick={() => handleGenreToggle(genre)}>
                        {genre}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap' }}>
                    {selectedGenres.map((genre) => (
                      <Chip key={genre} label={genre} onDelete={() => handleGenreToggle(genre)} sx={{ mr: 1, mb: 1 }} />
                    ))}
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, textTransform: 'none' }}
                    onClick={handleSignUp}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Link to="/">
              <Button >Cancel</Button>
            </Link>
          </DialogActions>
        </Dialog>
      )}
      <Footer />
    </>
  );
};

export default SellerDashboard;
