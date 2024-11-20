import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { Box, Button, Dialog, DialogContent, DialogActions } from '@mui/material';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const MapComponent = () => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });
    if (!mapInstance.current && mapContainer.current) {
      mapInstance.current = L.map(mapContainer.current).setView([31.2516164, 75.7039929], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstance.current);

      mapInstance.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        placeMarker(lat, lng);
        getGeocodedAddress(lat, lng); // Open the dialog on map click
        //setDialogOpen(true); // Open dialog when user clicks on map
      });
    }
  }, []);

  const placeMarker = (lat, lng) => {
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstance.current.removeLayer(layer);
      }
    });
    L.marker([lat, lng]).addTo(mapInstance.current)
      .bindPopup(`Latitude: ${lat}, Longitude: ${lng}`)
      .openPopup();
  };

  const getGeocodedAddress = async (lat, lng) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    setAddress(data.display_name || "Address not found");
    sessionStorage.setItem('address', data.display_name);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        mapInstance.current.setView([latitude, longitude], 13);
        placeMarker(latitude, longitude);
        getGeocodedAddress(latitude, longitude);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleDialogOpen = () => {
    // Adjust the map size after the dialog opens
    if (mapInstance.current) {
      mapInstance.current.invalidateSize();
    }
  };

  return (
    <Box>
      <Box
        ref={mapContainer}
        sx={{
          width: '100%',
          height: '170px',
          borderRadius: '8px',
          cursor: 'pointer',
          position: "relative",
          overflow: "hidden",
        }}
      />
      <Button onClick={handleUseCurrentLocation} variant="contained" sx={{ marginBottom: '' }}>
        Use Current Location
      </Button>
      {<p>Double CLick on the Map Marker to Confirm Location.</p>}
      {/* Display the address below the map */}

      {/* Dialog for the larger map
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="md"
        onEntered={handleDialogOpen} // Trigger map size adjustment after dialog is open
      >
        <DialogContent sx={{ height: '500px', padding: 0 }}>
          <Box ref={mapContainer} style={{ height: '100%' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUseCurrentLocation} variant="contained">
            Move to Current Location
          </Button>
          <Button onClick={() => setDialogOpen(false)} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
};

export default MapComponent;
