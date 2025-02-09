import React, { useState } from 'react';
import { LogIn, Eye, EyeOff } from 'lucide-react';

export default function SignIn({ onSignUpClick, onSuccess }) {
const [credentials, setCredentials] = useState({ username: '', password: '' });
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await fetch(`${process.env.REACT_APP_AUTH_SERVICE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Authentification échouée');
    }

    onSuccess(data.token, data.user);
  } catch (err) {
    setError('Nom d\'utilisateur ou mot de passe incorrect');
  } finally {
    setLoading(false);
  }
};

return (
  <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
    <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <img 
          src="/logo_platforme.jpg" 
          alt="Logo" 
          className="mx-auto h-24 w-24 object-contain"
        />
        <img 
          src="/agrivision.jpg" 
          alt="AgriVision" 
          className="mx-auto h-16 mt-4 object-contain"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-green-700">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            required
            className="mt-1 block w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="Entrez votre nom d'utilisateur"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-green-700">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
              className="mt-1 block w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 pr-10"
              placeholder="Entrez votre mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
            >
             {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {loading ? (
            'Connexion...'
          ) : (
            <>
              <LogIn className="mr-2" /> Se Connecter
            </>
          )}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-green-600">
          Pas de compte ? {' '}
          <button 
            onClick={onSignUpClick}
            className="font-medium text-green-700 hover:text-green-500"
          >
            Créer un compte
          </button>
        </p>
      </div>
    </div>
  </div>
);
}