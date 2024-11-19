import React from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Box, 
  Typography, 
  useTheme,
  Card,
  CardContent
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register the components from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MonthlyEarningsChart = ({ earningsData }) => {
  const theme = useTheme();

  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: true, // Changed to true
    aspectRatio: 2, // Add this to control the aspect ratio
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
      y: {
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          callback: function(value) {
            return '₹' + value/1000 + 'k';
          }
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `Earnings: ₹${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 7,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.background.paper,
        borderWidth: 2,
      },
      line: {
        tension: 0.4,
      }
    },
  };

  // Data for the chart
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Earnings (₹)',
        data: earningsData,
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light + '33', // Add transparency
        fill: true,
        borderWidth: 3,
      },
    ],
  };

  return (
    <Card
      sx={{
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
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'text.primary',
              flex: 1,
              textAlign: 'center'
            }}
          >
            Monthly Earnings Overview
          </Typography>
        </Box>

        <Box 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            position: 'relative',
            width: '100%',
            height: '300px', // Fixed height
          }}
        >
          <Line 
            options={options} 
            data={data} 
            style={{ 
              width: '100%', 
              height: '100%' 
            }} 
          />
        </Box>

        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            mt: 2 
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              textAlign: 'center', 
              maxWidth: 400,
              opacity: 0.7
            }}
          >
            Tracking your monthly earnings progression throughout the year
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MonthlyEarningsChart;