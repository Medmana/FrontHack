// hooks/useRole.ts
import { useEffect, useState } from 'react';

export function useRole(requiredRole: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    // Vérifier si nous sommes côté client
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const checkAuth = () => {
      const accessToken = localStorage.getItem('access_token');
      const userRole = localStorage.getItem('user_role');
      const userData = localStorage.getItem('user_data');

      // Si le token d'accès est manquant, rediriger vers la page de connexion
      if (!accessToken) {
        window.location.href = '/';
        return false;
      }

      // Si les données utilisateur ou le rôle sont manquants
      if (!userRole || !userData) {
        window.location.href = '/';
        return false;
      }

      // Vérifier le rôle
      const roleMatches = userRole === requiredRole;
      
      // Rediriger si le rôle ne correspond pas
      if (!roleMatches) {
        window.location.href = '/unauthorized';
        return false;
      }

      return true;
    };

    const authValid = checkAuth();
    if (authValid) {
      setHasRole(true);
      setIsLoading(false);
    }
  }, [requiredRole]);

  return {
    hasRole,
    isLoading,
  };
}