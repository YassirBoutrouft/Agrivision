import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import MainLayout from './components/Layout/MainLayout';
import './styles/index.css';
import './styles/custom.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('signin'); // 'signin' | 'signup' | 'main'

  const handleAuthSuccess = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
    setCurrentView('main');
  };

  if (!isAuthenticated) {
    return currentView === 'signin' ? (
      <SignIn 
        onSuccess={handleAuthSuccess}
        onSignUpClick={() => setCurrentView('signup')}
      />
    ) : (
      <SignUp
        onSuccess={handleAuthSuccess}
        onSignInClick={() => setCurrentView('signin')}
      />
    );
  }

  return <MainLayout />;
}