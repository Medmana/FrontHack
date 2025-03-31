// hooks/useRole.ts
import { useEffect, useState } from 'react'

export function useRole(requiredRole: string) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasRole, setHasRole] = useState(false)

  useEffect(() => {
    // Vérifier si nous sommes côté client
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    const userRole = localStorage.getItem('user_role')
    const userData = localStorage.getItem('user_data')

    if (!userRole || !userData) {
      
      window.location.href = '/login'
      return
    }

    setHasRole(userRole === requiredRole)
    setIsLoading(false)

    if (userRole !== requiredRole) {
      // Attendre que le router soit prêt avant de rediriger
      
        window.location.href = '/unauthorized'
      
    }
  }, [requiredRole])

  return {
    hasRole,
    isLoading,
  }
}