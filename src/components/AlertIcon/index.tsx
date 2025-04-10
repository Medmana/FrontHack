import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BellIcon } from '@heroicons/react/24/outline';

export default function AlertIcon() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadAlerts = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/alerts/unread-count');
        const { count } = await res.json();
        setUnreadCount(count);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      }
    };

    // Fetch initial count
    fetchUnreadAlerts();
    
    // Optionnel: Mettre à jour périodiquement
    const interval = setInterval(fetchUnreadAlerts, 60000); // Toutes les minutes
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/alerts" className="relative">
      <BellIcon className="h-6 w-6 text-gray-600 hover:text-blue-500" />
      {unreadCount > 0 && (
  <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center 
    ${unreadCount > 0 ? 'animate-pulse' : ''}`}>
    {unreadCount}
  </span>
)}
    </Link>
  );
}