import React from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyEarningsChart = ({ earningsData }) => {
  // Chart.js options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Earnings Overview',
      },
    },
  };

  // Data for the chart
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Earnings (₹)',
        data: earningsData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4, // For smoother lines
        fill: true,
      },
    ],
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Monthly Earnings
      </Typography>
      <Line options={options} data={data} />
    </Box>
  );
};

export default MonthlyEarningsChart;
