import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SnowDepthChart() {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    fetch("/data/rdu-weather-history.json")
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
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  const chartData = {
    labels: weatherData.map((entry) =>
      entry.date.toISOString().split("T")[0] // Formater en YYYY-MM-DD
    ),
    datasets: [
      {
        label: "Snow Depth (inches)",
        data: weatherData.map((entry) => entry.snwd),
        backgroundColor: "rgba(128, 0, 128, 0.8)", // Purple with opacity
        borderColor: "rgba(128, 0, 128, 1)", // Solid purple border
        borderWidth: 2, // Line thickness
        borderRadius: 5, // Rounded bars
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14, // Font size for legend
          },
        },
      },
      title: {
        display: false, // Removed ChartJS title to avoid repetition
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          font: {
            size: 16, // Font size for x-axis title
          },
        },
        ticks: {
          autoSkip: true, // Évite le chevauchement des dates
          maxTicksLimit: 10, // Affiche un nombre raisonnable de dates
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: "Depth (inches)",
          font: {
            size: 16, // Font size for y-axis title
          },
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      {/* Title managed here */}
      <h2 className="text-xl font-bold text-center mb-4">Snow Depth Overview</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}