import React from 'react';
import { Box, Typography, TextField, Button, Link, Grid, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(45deg, #FFD700, #FF8C00)',
        color: '#000',
        padding: '20px 0rem 20px 5rem',
        marginTop: '40px',
      }}
    >
      {/* Main Footer Content */}
      <Grid container spacing={4}>
        {/* Exclusive Section */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Exclusive
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 2, fontSize: '14px' }}>
            Subscribe
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 2, fontSize: '14px' }}>
            Get 10% off your first order
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
            <TextField
              placeholder="Enter your email"
              variant="outlined"
              size="small"
              sx={{
                backgroundColor: '#fff',
                borderRadius: 1,
                flexGrow: 1,
                marginRight: 1,
                '& .MuiInputBase-input': {
                  padding: '10px',
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#000',
                color: '#FFD700',
                '&:hover': {
                  backgroundColor: '#FF8C00',
                },
              }}
            >
              ➤
            </Button>
          </Box>
        </Grid>

        {/* Support Section */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Support
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '14px' }}>
            111 Bijoy Sarani, Dhaka,
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '14px' }}>
            DH 1515, Bangladesh
          </Typography>
          <Typography variant="body2" sx={{ marginTop: 1, fontSize: '14px' }}>
            exclusive@gmail.com
          </Typography>
          <Typography variant="body2" sx={{ marginTop: 1, fontSize: '14px' }}>
            +88015-88888-9999
          </Typography>
        </Grid>

        {/* Account Section */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Account
          </Typography>
          {['My Account', 'Login / Register', 'Cart', 'Wishlist', 'Shop'].map((item) => (
            <Typography variant="body2" sx={{ fontSize: '14px', marginBottom: 1 }} key={item}>
              <Link
                href="#"
                underline="hover"
                color="inherit"
                sx={{
                  '&:hover': { color: '#FF8C00' },
                }}
              >
                {item}
              </Link>
            </Typography>
          ))}
        </Grid>

        {/* Quick Links Section */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Quick Links
          </Typography>
          {['Privacy Policy', 'Terms of Use', 'FAQ', 'Contact'].map((item) => (
            <Typography variant="body2" sx={{ fontSize: '14px', marginBottom: 1 }} key={item}>
              <Link
                href="#"
                underline="hover"
                color="inherit"
                sx={{
                  '&:hover': { color: '#FF8C00' },
                }}
              >
                {item}
              </Link>
            </Typography>
          ))}
        </Grid>

        {/* Social Media Links */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Follow Us
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, index) => (
              <IconButton
                key={index}
                sx={{
                  color: '#fff',
                  '&:hover': { color: '#FF8C00' },
                }}
              >
                <Icon />
              </IconButton>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Bottom Footer Links */}
      <Box
        sx={{   
          marginTop: 4,
          paddingTop: 2,
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          flexWrap: 'wrap',
        }}
      >
        {['Privacy Policy', 'Terms of Use', 'Sales and Refunds', 'Legal'].map((item) => (
          <Link
            href="#"
            underline="hover"
            color="inherit"
            sx={{
              fontSize: '14px',
              '&:hover': { color: '#FF8C00' },
            }}
            key={item}
          >
            {item}
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default Footer;
