'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) throw new Error('Échec de la déconnexion');

      // Supprimer le token côté client
      localStorage.removeItem('access_token');
      
      // Rediriger vers la page de login
      router.push('/');
      router.refresh(); // Forcer le rafraîchissement du cache
    } catch (error) {
      console.error('Logout error:', error);
      alert('Une erreur est survenue lors de la déconnexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center gap-2 rounded-sm bg-red-600 px-4 py-2 text-sm font-medium text-white transition duration-300 hover:bg-red-700 hover:bg-opacity-90 ${
        loading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <span className="animate-spin">↻</span>
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      <span>Déconnexion</span>
    </button>
  );
}