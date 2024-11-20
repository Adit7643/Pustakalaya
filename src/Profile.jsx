import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Avatar,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Grid,
    Fade,
} from '@mui/material';
import { Edit, LocationOn, Delete, AddCircle } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import axios from 'axios';
import MapComponent from './MapComponent';
import { firebaseConfig } from '../config';
import WishlistSection from './WishlistSection';
import Footer from './Footer';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);


// Styled Components for Enhanced Animations and Gradients
const AnimatedCard = styled(Card)(({ theme }) => ({
    transition: 'all 0.3s ease-in-out',
    background: 'linear-gradient(145deg, #f0f4f8, #ffffff)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    borderRadius: '16px',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
    },
}));

const GradientAvatar = styled(Avatar)(({ theme }) => ({
    background: 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)',
    border: '4px solid white',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.1) rotate(5deg)',
    },
}));

const ScrollableBox = styled(Box)(({ theme }) => ({
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '10px',
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '4px',
    },
}));

const Profile = () => {
    // ... (previous state and methods remain the same)
    const userEmail = localStorage.getItem('user');
    const [profileDetails, setProfileDetails] = useState({ name: '', email: '', address: '' });
    const [profileImage, setProfileImage] = useState('');
    const [orders, setOrders] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newAddressName, setNewAddressName] = useState('');
    const [addresses, setAddresses] = useState([]);

    // ... (previous useEffect and other methods remain the same)
    useEffect(() => {
        const fetchProfileDetails = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'user', userEmail));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setProfileDetails({ name: data.name, email: data.email, address: data.address || '' });
                    setProfileImage(data.image || '');
                }
            } catch (error) {
                console.error('Error fetching profile details:', error);
            }
        };

        const fetchOrders = async () => {
            try {
                const ordersCollection = collection(db, 'user', userEmail, 'orders');
                const orderSnapshot = await getDocs(ordersCollection);
                setOrders(orderSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        const fetchAddresses = async () => {
            try {
                const addressCollection = collection(db, 'user', userEmail, 'savedAddress');
                const addressSnapshot = await getDocs(addressCollection);
                setAddresses(addressSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };

        fetchProfileDetails();
        fetchOrders();
        fetchAddresses();
    }, [userEmail]);

    // Save new address
    const handleSaveAddress = async () => {
        try {
            const savedAddress = sessionStorage.getItem('address') || 'Address not found';
            const addressId = `${userEmail}-${newAddressName || 'Unnamed'}`;
            const updatedAddressDetails = {
                address: savedAddress,
                addressName: newAddressName || 'Unnamed Address',
            };

            await setDoc(doc(db, 'user', userEmail, 'savedAddress', addressId), updatedAddressDetails);

            setAddresses((prev) => [...prev, { id: addressId, ...updatedAddressDetails }]);
            setDialogOpen(false);


            setNewAddressName('');
        } catch (error) {
            console.error('Error saving address:', error);
        }
    };

    // Upload profile image
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

            try {
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    formData
                );
                const imageUrl = response.data.secure_url;
                setProfileImage(imageUrl);
                await setDoc(doc(db, 'user', userEmail), { image: imageUrl }, { merge: true });
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    // Delete address
    const handleDeleteAddress = async (addressId) => {
        try {
            await deleteDoc(doc(db, 'user', userEmail, 'savedAddress', addressId));
            setAddresses((prev) => prev.filter((address) => address.id !== addressId));
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    return (
        <>
        <Box
            sx={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                minHeight: '100vh',
                py: 4
            }}
        >
            <Box sx={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: { xs: 2, sm: 3 }
            }}>
                <Grid container spacing={4}>
                    {/* Profile Section */}
                    <Grid item xs={12} md={4}>
                        <Fade in={true} timeout={1000}>
                            <AnimatedCard>
                                <CardContent>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        sx={{ marginBottom: 3 }}
                                    >
                                        <GradientAvatar
                                            sx={{
                                                width: 140,
                                                height: 140,
                                                marginBottom: 2,
                                            }}
                                            src={profileImage}
                                        >
                                            {profileDetails.name[0]}
                                        </GradientAvatar>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 'bold',
                                                marginBottom: 1,
                                                background: 'linear-gradient(45deg, #6a11cb, #2575fc)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            {profileDetails.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            {profileDetails.email}
                                        </Typography>
                                    </Box>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        component="label"
                                        startIcon={<Edit />}
                                        sx={{
                                            background: 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                                            }
                                        }}
                                    >
                                        Upload Image
                                        <input
                                            hidden
                                            accept="image/*"
                                            type="file"
                                            onChange={handleImageUpload}
                                        />
                                    </Button>
                                </CardContent>
                            </AnimatedCard>
                        </Fade>
                    </Grid>

                    {/* Addresses Section */}
                    <Grid item xs={12} md={8}>
                        <Fade in={true} timeout={1500}>
                            <AnimatedCard>
                                <CardContent>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 2 }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                background: 'linear-gradient(45deg, #6a11cb, #2575fc)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            <LocationOn sx={{ marginRight: 1 }} /> Addresses
                                        </Typography>
                                        <IconButton
                                            color="primary"
                                            onClick={() => setDialogOpen(true)}
                                            sx={{
                                                transition: 'transform 0.3s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.2) rotate(360deg)',
                                                }
                                            }}
                                        >
                                            <AddCircle />
                                        </IconButton>
                                    </Box>

                                    <ScrollableBox>
                                        {addresses.length > 0 ? (
                                            addresses.map((address, index) => (
                                                <Fade in={true} timeout={500 * (index + 1)} key={address.id}>
                                                    <AnimatedCard
                                                        sx={{
                                                            marginBottom: 2,
                                                            background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
                                                        }}
                                                    >
                                                        <CardContent
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center'
                                                            }}
                                                        >
                                                            <Box>
                                                                <Typography
                                                                    variant="body 1"
                                                                >
                                                                    {address.addressName}
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    color="textSecondary"
                                                                >
                                                                    {address.address}
                                                                </Typography>
                                                            </Box>
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => handleDeleteAddress(address.id)}
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </CardContent>
                                                    </AnimatedCard>
                                                </Fade>
                                            ))
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                textAlign="center"
                                            >
                                                No addresses found.
                                            </Typography>
                                        )}
                                    </ScrollableBox>
                                </CardContent>
                            </AnimatedCard>
                        </Fade>
                    </Grid>

                    {/* Orders Section */}
                    <Grid item xs={12}>
                        <Fade in={true} timeout={2000}>
                            <AnimatedCard>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            marginBottom: 2
                                        }}
                                    >
                                        Orders
                                    </Typography>

                                    <ScrollableBox>
                                        {orders.map((order) => (
                                            <Fade in={true} timeout={500} key={order.id}>
                                                <AnimatedCard
                                                    sx={{
                                                        marginBottom: 2,
                                                        background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Typography>
                                                            <strong>Order ID:</strong> {order.id}
                                                        </Typography>
                                                        <Typography>
                                                            <strong>Order Date:</strong> {order.date || 'N/A'}
                                                        </Typography>
                                                        <Typography>
                                                            <strong>Payment ID:</strong> {order.paymentId || 'N/A'}
                                                        </Typography>
                                                        <Typography>
                                                            <strong>Items:</strong>
                                                        </Typography>
                                                        <List>
                                                            {order.orderItems?.map((item, index) => (
                                                                <ListItem key={index}>
                                                                    <ListItemAvatar>
                                                                        <Avatar src={item.image} />
                                                                    </ListItemAvatar>
                                                                    <ListItemText primary={item.name} secondary={`Qty: ${item.quantity}`} />
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </CardContent>
                                                </AnimatedCard>
                                            </Fade>
                                        ))}
                                    </ScrollableBox>
                                </CardContent>
                            </AnimatedCard>
                        </Fade>
                    </Grid>
                </Grid>
                <WishlistSection />
                

                {/* Add Address Dialog */}
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
                    <DialogContent>
                        <Typography variant="h6" gutterBottom>
                            Add New Address
                        </Typography>
                        <TextField
                            label="Address Name"
                            value={newAddressName}
                            onChange={(e) => setNewAddressName(e.target.value)}
                            fullWidth
                            sx={{ marginBottom: 2 }}
                        />
                        <MapComponent />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} variant="outlined">
                            Cancel
                        </Button>
                        <Button onClick={handleSaveAddress} variant="contained">
                            Save Address
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
        <Footer />
        </>
    );
};

export default Profile;