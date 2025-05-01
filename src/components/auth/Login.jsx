import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Veuillez renseigner email et mot de passe');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      onLogin();
    } catch (error) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      {error && (
        <div className="alert-danger mb-4">
          {error}
        </div>
      )}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Adresse email
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="input"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary-light)] border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Se souvenir de moi
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]">
              Mot de passe oublié?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary flex justify-center"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Pour tester l'application, utilisez :</p>
          <p className="mt-1">Email: <strong>producer@example.com</strong>, <strong>coop@example.com</strong> ou <strong>admin@agritech.com</strong></p>
          <p>Mot de passe: <strong>password</strong> (pour tous les comptes)</p>
        </div>
      </form>
    </div>
  );
};

export default Login;