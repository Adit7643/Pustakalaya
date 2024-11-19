import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Grid, 
  IconButton, 
  Container 
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  // Navigation links
  const navigationLinks = [
    { label: 'Home', path: '/' },
    { label: 'Books', path: '/buy' },
    { label: 'Categories', path: '/' },
    { label: 'Cart', path: '/cart' },
    { label: 'Wishlist', path: '/wishlist' },
    { label: 'Login', path: '/' },
  ];

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
        color: '#000',
        py: 4,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Decorative Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.1)',
          transform: 'skew(-10deg)',
          zIndex: 1,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Vision Section */}
          <Grid item xs={12} md={5}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold', 
                marginBottom: 2,
                color: '#2c3e50',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Our Vision
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                marginBottom: 2, 
                color: '#34495e',
                lineHeight: 1.6,
                textAlign: 'justify',
              }}
            >
              We are passionate about creating a transformative book marketplace that 
              bridges readers, sellers, and publishers. Our platform is designed to:
            </Typography>
            <Box 
              component="ul" 
              sx={{ 
                color: '#2c3e50', 
                pl: 2,
                '& li': { 
                  marginBottom: 1,
                  position: 'relative',
                  paddingLeft: 2,
                  '&:before': {
                    content: '"•"',
                    color: '#FF8C00',
                    fontWeight: 'bold',
                    position: 'absolute',
                    left: 0,
                  }
                }
              }}
            >
              <li>Empower local and independent book sellers</li>
              <li>Create innovative revenue streams</li>
              <li>Expand literary reach across regions</li>
              <li>Foster a vibrant reading community</li>
            </Box>
          </Grid>

          {/* Quick Links and Contact */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={3}>
              {/* Quick Links */}
              <Grid item xs={12} sm={4}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold', 
                    marginBottom: 2,
                    color: '#2c3e50',
                  }}
                >
                  Quick Links
                </Typography>
                {navigationLinks.map((link) => (
                  <Typography 
                    key={link.label}
                    onClick={() => navigate(link.path)}
                    sx={{
                      cursor: 'pointer',
                      color: '#34495e',
                      marginBottom: 1,
                      transition: 'color 0.3s ease',
                      '&:hover': { 
                        color: '#FF8C00',
                        transform: 'translateX(5px)',
                      }
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Grid>

              {/* Contact Info */}
              <Grid item xs={12} sm={4}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold', 
                    marginBottom: 2,
                    color: '#2c3e50',
                  }}
                >
                  Contact Us
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#34495e', 
                    marginBottom: 1 
                  }}
                >
                  Email: support@bookstore.com
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#34495e', 
                    marginBottom: 1 
                  }}
                >
                  Phone: +1 (555) 123-4567
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#34495e' 
                  }}
                >
                  Address: 123 Book Lane, 
                  Literary City, Book State
                </Typography>
              </Grid>

              {/* Social Media */}
              <Grid item xs={12} sm={4}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold', 
                    marginBottom: 2,
                    color: '#2c3e50',
                  }}
                >
                  Connect With Us
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[
                    { Icon: FacebookIcon, color: '#3b5998' },
                    { Icon: TwitterIcon, color: '#1da1f2' },
                    { Icon: InstagramIcon, color: '#c32aa3' },
                    { Icon: LinkedInIcon, color: '#0077b5' }
                  ].map(({ Icon, color }, index) => (
                    <IconButton
                      key={index}
                      sx={{
                        color: color,
                        background: 'rgba(255,255,255,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          transform: 'scale(1.2)',
                          background: color,
                          color: 'white'
                        }
                      }}
                    >
                      <Icon />
                    </IconButton>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Bottom Copyright */}
        <Box 
          sx={{ 
            mt: 4, 
            pt: 2, 
            borderTop: '1px solid rgba(0,0,0,0.1)', 
            textAlign: 'center' 
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#34495e',
              fontWeight: 'light'
            }}
          >
            © {new Date().getFullYear()} Book Store. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;