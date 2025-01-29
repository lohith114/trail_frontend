import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Grid } from '@mui/material';

const NoticeDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: 4, minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      {/* Dashboard Heading */}
      <Typography variant="h4" align="center" sx={{ marginBottom: 6, fontWeight: 'bold', color: '#7D0541' }}>
        Notice Management
      </Typography>

      {/* Buttons for Navigation */}
      <Grid container spacing={3} justifyContent="center" sx={{ marginBottom: 6 }}>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => navigate('/manage-notices')}
            sx={{
              width: 150,
              height: 150,
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '15px', // Rounded corners
              backgroundColor: '#00bcd4', // Light blue color
              boxShadow: 3,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: '#0097a7', // Darker shade of light blue
                transform: 'scale(1.05)',
              },
            }}
          >
            Manage Notices
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => navigate('/add-notice')}
            sx={{
              width: 150,
              height: 150,
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '15px', // Rounded corners
              backgroundColor: '#8bc34a', // Light green color
              boxShadow: 3,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: '#689f38', // Darker shade of light green
                transform: 'scale(1.05)',
              },
            }}
          >
            Add Notice
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NoticeDashboard;