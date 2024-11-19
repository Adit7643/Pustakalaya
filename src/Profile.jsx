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
} from '@mui/material';
import { Edit, LocationOn, Delete } from '@mui/icons-material';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import axios from 'axios';
import MapComponent from './MapComponent';
import { firebaseConfig } from '../config';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const Profile = () => {
    const userEmail = localStorage.getItem('user');
    const [profileDetails, setProfileDetails] = useState({ name: '', email: '', address: '' });
    const [profileImage, setProfileImage] = useState('');
    const [orders, setOrders] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newAddressName, setNewAddressName] = useState('');
    const [addresses, setAddresses] = useState([]);

    // Fetch profile details, orders, and addresses
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
        <Box sx={{ padding: 3 }}>
            {/* Profile Section */}
            <Card sx={{ marginBottom: 3 }}>
                <CardContent>
                    <Box display="flex" alignItems="center" sx={{ marginBottom: 3 }}>
                        <Avatar sx={{ width: 80, height: 80, marginRight: 3 }} src={profileImage}>
                            {profileDetails.name[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                {profileDetails.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {profileDetails.email}
                            </Typography>
                        </Box>
                        <Box ml="auto">
                            <Button variant="outlined" component="label" startIcon={<Edit />}>
                                Upload Image
                                <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
                            </Button>
                        </Box>
                    </Box>

                    {/* Address Section */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ marginRight: 1 }} /> Addresses
                    </Typography>
                    {addresses.length > 0 ? (
                        addresses.map((address) => (
                            <Card key={address.id} sx={{ marginTop: 2, padding: 2, boxShadow: 3 }}>
                                <CardContent>
                                    <Typography variant="body1">{address.address}</Typography>
                                    <Box display="flex" justifyContent="flex-end">
                                        <IconButton onClick={() => handleDeleteAddress(address.id)}>
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No addresses found.
                        </Typography>
                    )}
                    <Button onClick={() => setDialogOpen(true)} sx={{ marginTop: 2 }}>
                        Add Address
                    </Button>
                </CardContent>
            </Card>

            {/* Orders Section */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Orders
                    </Typography>
                    {orders.map((order) => (
                        <Card key={order.id} sx={{ marginTop: 2, padding: 2, boxShadow: 3 }}>
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
                        </Card>
                    ))}
                </CardContent>
            </Card>

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
    );
};

export default Profile;
