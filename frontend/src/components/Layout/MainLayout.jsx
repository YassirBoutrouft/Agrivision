import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ImageGallery from '../Dashboard/ImageGallery';
import DataCharts from '../Dashboard/DataCharts';
import WeatherChart from '../WeatherChart';
import PrecipitationSnowChart from '../PrecipitationSnowChart';
import WindSpeedChart from '../WindSpeedChart';
import SnowDepthChart from '../SnowDepthChart';

export default function MainLayout() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'images':
        return <ImageGallery />;
      case 'statistics':
        return <DataCharts />;
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary-800 mb-4">Settings</h2>
            <p>Settings page</p>
          </div>
        );
      default:
        return (
          <div className="bg-gray-50 min-h-screen">
            <div className="bg-primary-50 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">Dashboard</h2>
              <p className="text-primary-700">Welcome to your dashboard</p>
            </div>

            {/* Graphs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6 items-stretch">
              <div className="bg-white p-4 shadow rounded-lg h-80">
                <WeatherChart />
              </div>
              <div className="bg-white p-4 shadow rounded-lg h-80">
                <PrecipitationSnowChart />
              </div>
              <div className="bg-white p-4 shadow rounded-lg h-80">
                <WindSpeedChart />
              </div>
              <div className="bg-white p-4 shadow rounded-lg h-80">
                <SnowDepthChart />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-primary-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 p-8 overflow-auto">
        <div className="container mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}