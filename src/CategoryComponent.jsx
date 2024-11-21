import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Rating,
    Card,
    CardContent,
    CardActions,
    ButtonGroup,
    CardMedia,
    IconButton
} from '@mui/material';
import { initializeApp } from 'firebase/app';
import { 
    getFirestore, 
    collection, 
    getDocs 
} from 'firebase/firestore';
import { firebaseConfig } from '../config';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const CategoryComponent = ({ 
    category = null, 
    onAddToCart, 
    onQuantityChange, 
    cart, 
    onWishlistToggle, 
    wishlist 
}) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const booksCollection = collection(db, 'Books');
                const booksSnapshot = await getDocs(booksCollection);
                const booksData = booksSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Filter books by category if provided
                const filteredBooks = category 
                    ? booksData.filter(book => book.category === category)
                    : booksData;

                setBooks(filteredBooks);
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [category]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)'
                },
                gap: 3,
                p: 3,
                width: '100%'
            }}
        >
            {books.length === 0 ? (
                <Box sx={{ gridColumn: 'span 4', textAlign: 'center' }}>
                    <Typography variant="h6">
                        No books found {category ? `in ${category} category` : ''}
                    </Typography>
                </Box>
            ) : (
                books.map((book) => (
                    <Card 
                        key={book.id}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '400px',
                            position: 'relative',
                            transition: 'transform 0.3s',
                            '&:hover': {
                                transform: 'scale(1.05)'
                            }
                        }}
                    >
                        {/* Wishlist Icon */}
                        <IconButton
                            onClick={() => onWishlistToggle(book)}
                            sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                zIndex: 10,
                                backgroundColor: 'rgba(255,255,255,0.7)'
                            }}
                        >
                            {wishlist[book.id] ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                        </IconButton>

                        {/* Book Image */}
                        <CardMedia
                            component="img"
                            height="200"
                            image={book.image || 'default-image.jpg'}
                            alt={book.name}
                            sx={{ objectFit: 'cover' }}
                        />

                        {/* Book Details */}
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography 
                                variant="h6" 
                                noWrap 
                                sx={{ fontWeight: 'bold' }}
                            >
                                {book.name}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                            >
                                {book.author}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                color="primary" 
                                sx={{ fontWeight: 'bold' }}
                            >
                                ₹{book.price}
                            </Typography>

                            {/* Rating */}
                            <Rating 
                                value={book.rating || 4} 
                                readOnly 
                                sx={{ mt: 1 }}
                            />
                        </CardContent>

                        {/* Cart Actions */}
                        <CardActions>
                            {!cart[book.id] || cart[book.id] === 0 ? (
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    onClick={() => onAddToCart(book.id)}
                                >
                                    Add to Cart
                                </Button>
                            ) : (
                                <ButtonGroup fullWidth>
                                    <Button 
                                        variant="outlined" 
                                        onClick={() => onQuantityChange(book.id, -1)}
                                    >
                                        -
                                    </Button>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            px: 2 
                                        }}
                                    >
                                        {cart[book.id]}
                                    </Typography>
                                    <Button 
                                        variant="outlined" 
                                        onClick={() => onQuantityChange(book.id, 1)}
                                    >
                                        +
                                    </Button>
                                </ButtonGroup>
                            )}
                        </CardActions>
                    </Card>
                ))
            )}
        </Box>
    );
};

export default CategoryComponent;