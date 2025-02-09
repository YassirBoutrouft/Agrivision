import React from 'react';
import { AgCharts } from 'ag-charts-react';

export default function DataCharts() {
  // Graphique 1 : Température et Humidité Moyennes
  const tempHumidityOptions = {
    title: {
      text: "Température et Humidité Moyennes",
    },
    data: [
      { month: 'Jan', temperature: 5, humidity: 80 },
      { month: 'Fév', temperature: 7, humidity: 75 },
      { month: 'Mars', temperature: 12, humidity: 70 },
      { month: 'Avr', temperature: 18, humidity: 65 },
      { month: 'Mai', temperature: 22, humidity: 60 },
      { month: 'Juin', temperature: 28, humidity: 55 },
      { month: 'Juil', temperature: 32, humidity: 50 },
      { month: 'Août', temperature: 31, humidity: 55 },
      { month: 'Sept', temperature: 25, humidity: 60 },
      { month: 'Oct', temperature: 18, humidity: 65 },
      { month: 'Nov', temperature: 10, humidity: 75 },
      { month: 'Déc', temperature: 6, humidity: 80 },
    ],
    series: [
      { type: 'line', xKey: 'month', yKey: 'temperature', yName: 'Température (°C)', stroke: '#FF5722' },
      { type: 'line', xKey: 'month', yKey: 'humidity', yName: 'Humidité (%)', stroke: '#03A9F4' },
    ],
    legend: {
      position: 'bottom',
    },
  };

  // Graphique 2 : Rendement des Cultures
  const cropYieldOptions = {
    title: {
      text: "Rendement des Cultures",
    },
    data: [
      { crop: 'Blé', actual: 450, target: 500 },
      { crop: 'Maïs', actual: 380, target: 420 },
      { crop: 'Soja', actual: 300, target: 350 },
      { crop: 'Orge', actual: 200, target: 250 },
    ],
    series: [
      { type: 'column', xKey: 'crop', yKey: 'actual', yName: 'Production Actuelle (t)', fill: '#4CAF50' },
      { type: 'column', xKey: 'crop', yKey: 'target', yName: 'Production Cible (t)', fill: '#FFC107' },
    ],
    legend: {
      position: 'bottom',
    },
  };

  // Graphique 3 : Répartition des Ressources
  const resourceUsageOptions = {
    title: {
      text: "Répartition des Ressources Utilisées",
    },
    data: [
      { resource: 'Eau', usage: 40 },
      { resource: 'Engrais', usage: 30 },
      { resource: 'Pesticides', usage: 20 },
      { resource: 'Énergie', usage: 10 },
    ],
    series: [
      { type: 'pie', angleKey: 'usage', labelKey: 'resource' },
    ],
    legend: {
      position: 'right',
    },
  };

  // Graphique 4 : Santé des Cultures par Zone
  const cropHealthOptions = {
    title: {
      text: "Indice de Santé des Cultures par Zone",
    },
    data: [
      { zone: 'Zone A', health: 95 },
      { zone: 'Zone B', health: 85 },
      { zone: 'Zone C', health: 90 },
      { zone: 'Zone D', health: 80 },
    ],
    series: [
      { type: 'bar', xKey: 'zone', yKey: 'health', yName: 'Santé (%)', fill: '#03A9F4' },
    ],
    legend: {
      position: 'bottom',
    },
  };

  // Graphique 5 : Évolution du Stock d'Eau
  const waterStockOptions = {
    title: {
      text: "Évolution du Stock d'Eau (en m³)",
    },
    data: [
      { week: 'Semaine 1', stock: 150 },
      { week: 'Semaine 2', stock: 140 },
      { week: 'Semaine 3', stock: 130 },
      { week: 'Semaine 4', stock: 120 },
    ],
    series: [
      { type: 'area', xKey: 'week', yKey: 'stock', yName: 'Stock (m³)', fill: 'rgba(63, 81, 181, 0.5)', stroke: '#3F51B5' },
    ],
    legend: {
      position: 'bottom',
    },
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Température et Humidité */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <AgCharts options={tempHumidityOptions} />
        </div>

        {/* Rendement des Cultures */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <AgCharts options={cropYieldOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Répartition des Ressources */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <AgCharts options={resourceUsageOptions} />
        </div>

        {/* Santé des Cultures */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <AgCharts options={cropHealthOptions} />
        </div>
      </div>

      {/* Évolution du Stock d'Eau */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <AgCharts options={waterStockOptions} />
      </div>
    </div>
  );
}
