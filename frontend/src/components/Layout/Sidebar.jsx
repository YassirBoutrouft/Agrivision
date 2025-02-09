import React, { useState } from 'react';
import { 
  Home, 
  Image, 
  BarChart, 
  Settings, 
  LogOut, 
  Menu 
} from 'lucide-react';

export default function Sidebar({ activeSection, onSectionChange }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { 
      id: 'dashboard',
      icon: <Home />, 
      text: 'Dashboard'
    },
    { 
      id: 'images',
      icon: <Image />, 
      text: 'My Images'
    },
    { 
      id: 'statistics',
      icon: <BarChart />, 
      text: 'Statistics'
    },
    { 
      id: 'settings',
      icon: <Settings />, 
      text: 'Settings'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div 
      className={`bg-white shadow-xl h-screen transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-20'
      } flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
  {isExpanded && (
    <h1 className="text-2xl font-bold text-green-700 ml-2" style={{ fontFamily: 'cursive', fontStyle: 'italic' }}>
      AgriVision
    </h1>
  )}
</div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-green-700 hover:bg-green-100 p-2 rounded"
        >
          <Menu />
        </button>
      </div>

      <nav className="flex-1 pt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center p-4 hover:bg-green-100 transition-colors ${
              activeSection === item.id ? 'bg-green-100' : ''
            }`}
          >
            <div className="mx-4">{item.icon}</div>
            {/* Display the menu text only if the sidebar is expanded */}
            {isExpanded && (
              <span className="text-green-800">{item.text}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="border-t p-4">
        {/* Logout button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center hover:bg-red-100 p-2 rounded text-red-600"
        >
          <LogOut className="mr-2" />
          {isExpanded && 'Logout'}
        </button>
      </div>
    </div>
  );
}