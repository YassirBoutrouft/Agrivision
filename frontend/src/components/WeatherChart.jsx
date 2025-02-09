import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
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

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function WeatherChart() {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    fetch('/data/rdu-weather-history.json')
      .then((response) => response.json())
      .then((data) => {
        // Convertir les dates en objets Date et trier
        const sortedData = data
          .map((entry) => ({
            ...entry,
            date: new Date(entry.date), // Convertir en objet Date
          }))
          .sort((a, b) => a.date - b.date); // Trier par date

        setWeatherData(sortedData);
      })
      .catch((error) => console.error('Error loading data:', error));
  }, []);

  const chartData = {
    labels: weatherData.map((entry) =>
      entry.date.toISOString().split('T')[0] // Formater en YYYY-MM-DD
    ),
    datasets: [
      {
        label: 'Minimum Temperature (°F)',
        data: weatherData.map((entry) => entry.tmin),
        borderColor: 'rgba(54, 162, 235, 0.8)', // Blue with transparency
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light blue for point fill
        pointBorderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2, // Line thickness
        pointRadius: 4, // Point size
      },
      {
        label: 'Maximum Temperature (°F)',
        data: weatherData.map((entry) => entry.tmax),
        borderColor: 'rgba(255, 99, 132, 0.8)', // Red with transparency
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Light red for point fill
        pointBorderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2, // Line thickness
        pointRadius: 4, // Point size
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Position of the legend
        labels: {
          font: {
            size: 14, // Font size for legend labels
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 16, // Font size for x-axis title
          },
        },
        ticks: {
          autoSkip: true, // Évite le chevauchement des dates
          maxTicksLimit: 10, // Affiche un nombre raisonnable de labels
          maxRotation: 45, // Incline les dates pour meilleure lisibilité
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (°F)',
          font: {
            size: 16, // Font size for y-axis title
          },
        },
        ticks: {
          beginAtZero: true, // Start the y-axis at 0
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">Temperature Overview</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}