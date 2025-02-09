import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Enregistrer manuellement les échelles et les éléments
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function PrecipitationSnowChart() {
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
        label: 'Precipitation (inches)',
        data: weatherData.map((entry) => entry.prcp),
        backgroundColor: 'rgba(54, 162, 235, 0.7)', // Transparent blue
        borderColor: 'rgba(54, 162, 235, 1)', // Solid blue border
        borderWidth: 1,
        barThickness: 10, // Ajuster l'épaisseur des barres
      },
      {
        label: 'Snow (inches)',
        data: weatherData.map((entry) => entry.snow),
        backgroundColor: 'rgba(128, 128, 128, 0.7)', // Transparent gray
        borderColor: 'rgba(128, 128, 128, 1)', // Solid gray border
        borderWidth: 1,
        barThickness: 10, // Ajuster l'épaisseur des barres
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Positionner la légende en haut
        labels: {
          font: {
            size: 12, // Ajuster la taille de la police
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
            size: 14, // Ajuster la taille de la police
          },
        },
        ticks: {
          autoSkip: true, // Éviter le chevauchement des dates
          maxTicksLimit: 10, // Afficher un nombre raisonnable de dates
        },
      },
      y: {
        title: {
          display: true,
          text: 'Inches',
          font: {
            size: 14, // Ajuster la taille de la police
          },
        },
        ticks: {
          beginAtZero: true, // S'assurer que l'axe Y commence à 0
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">Precipitation and Snow</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}