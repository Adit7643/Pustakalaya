import React, { useState, useEffect } from 'react';
import { Box, Fab, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Card, CardContent, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SellerNavigation from './SellerNavigation';
import { initializeApp } from 'firebase/app';
import { getDoc,deleteDoc, updateDoc, getDocs, getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../config';
import { useNavigate } from 'react-router-dom';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const Listing = () => {
  const [open, setOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [bookDetails, setBookDetails] = useState({
    name: '',
    author: '',
    publisher: '',
    stock: '',
    isbn: '',
    price: '',
    image: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const sellerEmail = localStorage.getItem("seller");

    const fetchBooks = async () => {
      try {
        const sellerDocRef = doc(db, "sellers", sellerEmail);
        const listingsCollectionRef = collection(sellerDocRef, "listings");
        const listingsSnapshot = await getDocs(listingsCollectionRef);

        const booksData = listingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log(booksData);
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [navigate]);


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleImageChange = (e) => {
    setBookDetails((prevDetails) => ({ ...prevDetails, image: e.target.files[0] }));
  };

  const handleAddBook = async () => {

    if (Object.values(bookDetails).some((value) => !value)) {
      alert('Please fill in all details');
      return;
    }

    if (bookDetails.image) {
      const formData = new FormData();
      formData.append('file', bookDetails.image);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        const imageUrl = data.secure_url;

        // Add the image URL to book details before saving to Firestore
        const sellerEmail = localStorage.getItem('seller');
        const bookData = {
          ...bookDetails,
          image: imageUrl,
          bookid: `${bookDetails.name}-${sellerEmail}`,
          seller_email: sellerEmail,
        };

        // Store in local state
        setBooks((prevBooks) => [
          ...prevBooks,
          { ...bookData, id: prevBooks.length + 1 },
        ]);
        // Firebase code to add book
        const bookDocRef = `${sellerEmail}-${bookDetails.name}`;
        const bookRef = doc(db, "Books", bookDocRef);
        await setDoc(bookRef, bookData); // Use bookData to include the image URL

        const sellerDocRef = doc(db, "sellers", sellerEmail);
        const listingDocRef = doc(
          collection(sellerDocRef, "listings"),
          `${sellerEmail}-${bookDetails.name}`
        );
        const listingSnapshot = await getDoc(listingDocRef);
        if (!listingSnapshot.exists()) {
          // If it doesn't exist, create it
          await setDoc(listingDocRef, {
            ...bookData // Spread the book details here, assuming it contains necessary fields
          });
          console.log("Listing added successfully!");
        } else {
          console.log("Listing already exists.");
        }
        handleClose();
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };


  const handleEditPrice = async (id) => {

    const sellerEmail = localStorage.getItem("seller");
    const newPrice = prompt('Enter new price');
    if (newPrice) {
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === id ? { ...book, price: newPrice } : book))
      );
    }
    const bookRef = doc(db, "Books", id);
    updateDoc(bookRef, {
      price: newPrice
    })
      .then(() => {
        console.log("Price updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating price: ", error);
      });

    const sellerDocRef = doc(db, "sellers", sellerEmail);
    const listingDocRef = doc(
      collection(sellerDocRef, "listings"),
      id
    );
    updateDoc(listingDocRef, {
      price: newPrice
    })
      .then(() => {
        console.log("Price updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating price: ", error);
      });
  };

  const handleDelete = async (id) =>{
    const sellerEmail = localStorage.getItem("seller");
    const bookRef = doc(db, "Books", id);
    await deleteDoc(bookRef);

    const sellerDocRef = doc(db, "sellers", sellerEmail);
    const listingDocRef = doc(
      collection(sellerDocRef, "listings"),
      id
    );
    await deleteDoc(listingDocRef);
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
  };
  
  return (
    <>
      <SellerNavigation />
      <div style={{ padding: '0 5rem', position: 'relative' }}>
        <h2>Books Listed</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {books.map((book) => (
            <Card key={book.id} style={{padding: '0', display: 'flex', flexDirection: 'row', position: 'relative',width:"25rem",height:"25rem" }}>
              {/* Left Half - Image and Buttons */}
              <Box style={{ width: '50%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {book.image && (
                  <img
                    src={book.image}
                    alt={book.name}
                    style={{ width: '100%', height:'100%', objectFit: 'cover' }}
                  />
                )}
                {/* Edit and Delete buttons below the image */}
               
              </Box>

              {/* Right Half - Book Details */}
              <Box style={{ width: '50%', padding: '10px' }}>
                <Typography variant="h6">{book.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Author: {book.author}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Publisher: {book.publisher}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Stock: {book.stock}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ISBN: {book.isbn}
                </Typography>
                <Typography variant="body2">Price: ₹{book.price}</Typography>
                <Box style={{ marginTop: '10px', display: 'flex', justifyContent: 'left' }}>
                  <IconButton onClick={() => handleEditPrice(book.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(book.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Card>

          ))}
        </div>


        <Fab
          color="primary"
          aria-label="add"
          onClick={handleOpen}
          style={{ position: 'fixed', bottom: '20px', right: '20px' }}
        >
          <AddIcon />
        </Fab>

        <Dialog
          open={open}
          onClose={handleClose}
          sx={{
            '& .MuiDialog-paper': {
              padding: { xs: '15px', sm: '20px' },
              borderRadius: '10px',
              width: { xs: '90vw', sm: '400px' },
              maxWidth: '90vw',
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: { xs: '18px', sm: '20px' }
            }}
          >
            Add a New Book
          </DialogTitle>
          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: '10px', sm: '15px' },
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Book Name"
              type="text"
              fullWidth
              value={bookDetails.name}
              onChange={handleChange}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  fontSize: { xs: '14px', sm: '16px' }
                }
              }}
            />
            <TextField
              margin="dense"
              name="author"
              label="Author"
              type="text"
              fullWidth
              value={bookDetails.author}
              onChange={handleChange}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  fontSize: { xs: '14px', sm: '16px' }
                }
              }}
            />
            <TextField
              margin="dense"
              name="publisher"
              label="Publisher"
              type="text"
              fullWidth
              value={bookDetails.publisher}
              onChange={handleChange}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  fontSize: { xs: '14px', sm: '16px' }
                }
              }}
            />

            <TextField
              margin="dense"
              name="stock"
              label="Stock Quantity"
              type="number"
              fullWidth
              value={bookDetails.stock}
              onChange={handleChange}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  fontSize: { xs: '14px', sm: '16px' }
                }
              }}
            />
            <TextField
              margin="dense"
              name="isbn"
              label="ISBN Number"
              type="text"
              fullWidth
              value={bookDetails.isbn}
              onChange={handleChange}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  fontSize: { xs: '14px', sm: '16px' }
                }
              }}
            />

            <Box sx={{ display: 'flex', gap: '10px', width: '100%' }}>
              <TextField
                margin="dense"
                name="price"
                label="Price"
                type="number"
                fullWidth
                value={bookDetails.price}
                onChange={handleChange}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                    fontSize: { xs: '14px', sm: '16px' }
                  }
                }}
              />
              <TextField
                margin="dense"
                name="discount"
                label="Discount (%)"
                type="number"
                fullWidth
                value={bookDetails.discount}
                onChange={handleChange}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                    fontSize: { xs: '14px', sm: '16px' }
                  }
                }}
              />
            </Box>

            <TextField
              margin="dense"
              name="image"
              type="file"
              fullWidth
              onChange={handleImageChange}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  fontSize: { xs: '14px', sm: '16px' }
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', gap: '10px' }}>
            <Button
              onClick={handleClose}
              color="secondary"
              variant="outlined"
              sx={{
                px: { xs: 3, sm: 4 },
                fontSize: { xs: '14px', sm: '16px' }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddBook}
              color="primary"
              variant="contained"
              sx={{
                px: { xs: 3, sm: 4 },
                fontSize: { xs: '14px', sm: '16px' }
              }}
            >
              Add Book
            </Button>
          </DialogActions>
        </Dialog>



      </div>
    </>
  );
};

export default Listing;
