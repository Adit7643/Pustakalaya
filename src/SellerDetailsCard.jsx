import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { getFirestore, doc, updateDoc,getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config';
import MapComponent from './MapComponent';

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

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

const SellerDetailsCard = () => {
  const [sellerDetails, setSellerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const sellerEmail = localStorage.getItem('seller');
        if (sellerEmail) {
          const sellerDocRef = doc(db, 'sellers', sellerEmail);
          const sellerDocSnap = await getDoc(sellerDocRef);

          if (sellerDocSnap.exists()) {
            const details = sellerDocSnap.data();
            setSellerDetails(details);
            setEditedDetails(details);
            setSelectedGenres(details.genres || []);
          } else {
            console.warn("No seller document found.");
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching seller details:", error);
        setLoading(false);
      }
    };

    fetchSellerDetails();
  }, []);

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleUpdateDetails = async () => {
    try {
      const sellerEmail = localStorage.getItem('seller');
      const sellerDocRef = doc(db, 'sellers', sellerEmail);
      
      // Check for warehouse location from session storage
      const storedAddress = sessionStorage.getItem('address');
      if (storedAddress) {
        editedDetails.warehouseLocation = storedAddress;
      }

      // Update document with new details and genres
      await updateDoc(sellerDocRef, {
        ...editedDetails,
        genres: selectedGenres
      });

      // Update local state
      setSellerDetails({
        ...editedDetails,
        genres: selectedGenres
      });

      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating seller details:", error);
    }
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6">Seller Details</Typography>
          <Typography variant="body2">Loading...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!sellerDetails) {
    return null;
  }

  // Prepare seller details for display
  const sellerDetailItems = [
    { 
      label: "Enterprise Name", 
      value: sellerDetails.enterpriseName || 'Not Provided',
      name: 'enterpriseName'
    },
    { 
      label: "Seller Name", 
      value: sellerDetails.sellerName || 'Not Provided',
      name: 'sellerName'
    },
    { 
      label: "Email", 
      value: sellerDetails.email,
      name: 'email',
      disabled: true
    },
    { 
      label: "GST Number", 
      value: sellerDetails.Gst_Number || 'Not Provided',
      name: 'Gst_Number'
    },
    { 
      label: "Annual Revenue", 
      value: sellerDetails.revenue ? `₹${sellerDetails.revenue}` : 'Not Provided',
      name: 'revenue'
    },
    { 
      label: "Warehouse Location", 
      value: sellerDetails.warehouseLocation || 'Not Provided',
      name: 'warehouseLocation',
      isMap: true
    }
  ];

  return (
    <>
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
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Seller Profile
            </Typography>
            <Box>
              <Chip
                label="Active"
                color="success"
                size="small"
                sx={{ fontWeight: 'bold', mr: 1 }}
              />
              <IconButton onClick={handleOpenEditDialog} size="small">
                <EditIcon />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ mt: 2, maxHeight: 500, overflow: 'auto' }}>
            <List>
              {sellerDetailItems.map((item, index) => (
                <React.Fragment key={item.label}>
                  <ListItem>
                    <ListItemText 
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {item.label}
                        </Typography>
                      } 
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {item.value}
                        </Typography>
                      } 
                    />
                  </ListItem>
                  {index < sellerDetailItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>

          {sellerDetails.genres && sellerDetails.genres.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Selected Genres
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {sellerDetails.genres.map((genre) => (
                  <Chip 
                    key={genre} 
                    label={genre} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                ))}
              </Box>
            </Box>
          )}

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              textAlign: 'center', 
              mt: 2, 
              opacity: 0.7 
            }}
          >
            Your verified seller profile details
          </Typography>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit Seller Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {sellerDetailItems
              .filter(item => !item.disabled)
              .map((item) => (
                item.isMap ? (
                  <Box key={item.name} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="subtitle1">{item.label}</Typography>
                    <Box sx={{ height: '300px', width: '100%' }}>
                      <MapComponent />
                    </Box>
                  </Box>
                ) : (
                  <TextField
                    key={item.name}
                    name={item.name}
                    label={item.label}
                    fullWidth
                    variant="outlined"
                    value={editedDetails[item.name] || ''}
                    onChange={handleInputChange}
                  />
                )
              ))}

            {/* Genre Selection */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Select Genres
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {genres.map((genre) => (
                  <Chip
                    key={genre}
                    label={genre}
                    onClick={() => handleGenreToggle(genre)}
                    color={selectedGenres.includes(genre) ? 'primary' : 'default'}
                    variant={selectedGenres.includes(genre) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateDetails} color="primary" variant="contained">
            Update Profile
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SellerDetailsCard;