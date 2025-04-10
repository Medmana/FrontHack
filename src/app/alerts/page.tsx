'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Bell, CheckCircle, Filter, X } from 'lucide-react';
const Button = ({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  onClick,
  ...props
}: {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm';
  className?: string;
  onClick?: () => void;
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none';
  const sizeStyles = size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-4 py-2';
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    ghost: 'hover:bg-gray-100',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Composant DropdownMenu personnalisé
const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>;
};

const DropdownMenuTrigger = ({ children }: { children: React.ReactNode }) => {
  return <div className="cursor-pointer">{children}</div>;
};

const DropdownMenuContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute z-50 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
      {children}
    </div>
  );
};

const DropdownMenuItem = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface Alert {
  _id: string;
  patient: {
    _id: string;
    firstName: string;
    lastName: string;
    fileNumber: string;
  };
  reason: string;
  creatinineLevel: number;
  isActive: boolean;
  isRead: boolean;
  createdAt: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [readStatus, setReadStatus] = useState<'read' | 'unread' | undefined>();
  const [loading, setLoading] = useState(true);

  // Récupérer les alertes
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (readStatus) params.set('readStatus', readStatus);

      const res = await fetch(`http://localhost:3000/api/alerts?${params.toString()}`);
      const data = await res.json();
      setAlerts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [status, readStatus]);

  // Marquer comme lu
  const markAsRead = async (alertId: string) => {
    await fetch(`http://localhost:3000/api/alerts/${alertId}/read`, { method: 'PUT' });
    fetchAlerts();
  };

  // Résoudre une alerte
  const resolveAlert = async (alertId: string) => {
    await fetch(`http://localhost:3000/api/alerts/${alertId}/resolve`, { method: 'PUT' });
    fetchAlerts();
  };

  // Supprimer une alerte
  const deleteAlert = async (alertId: string) => {
    await fetch(`http://localhost:3000/api/alerts/${alertId}`, { method: 'DELETE' });
    fetchAlerts();
  };

  // Marquer toutes comme lues
  const markAllAsRead = async () => {
    await fetch('http://localhost:3000/api/alerts/mark-all-read', { method: 'PUT' });
    fetchAlerts();
  };

  return (
    <div className="container px-4 pt-20 pb-8">
      <div className="flex items-center gap-3 mb-8">
        <AlertTriangle className="text-yellow-500" size={28} />
        <h1 className="text-2xl font-bold">Gestion des Alertes</h1>
      </div>

      {/* Barre d'outils */}
     

      {/* Liste des alertes */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune alerte trouvée</h3>
          <p className="mt-1 text-gray-500">
            {status === 'active' 
              ? "Vous n'avez aucune alerte active" 
              : "Vous n'avez aucune alerte inactive"}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
  <ul className="divide-y divide-gray-200">
    {alerts.map((alert) => (
      <li 
        key={alert._id} 
        className={`p-4 ${alert.isActive ? 'bg-red-50' : 'bg-white'} ${!alert.isRead ? 'border-l-4 border-red-500' : ''}`}
      >
        <div className="flex justify-between items-start">
          {/* Zone cliquable pour la redirection */}
          <div 
            className="flex-1 cursor-pointer"
            onClick={() => window.location.href = `/afficher_dossier/${alert.patient._id}`}
          >
            <div className="flex items-center gap-2">
              <h3 className="font-medium hover:text-blue-600 hover:underline">
                {alert.patient.firstName} {alert.patient.lastName}
                <span className="text-gray-500 ml-2">(Dossier: {alert.patient.fileNumber})</span>
              </h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                alert.reason === 'chronique' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {alert.reason.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Créatinine: {alert.creatinineLevel} mg/dL • 
              <span className="ml-2">
                {new Date(alert.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>

          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            {!alert.isRead && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => markAsRead(alert._id)}
              >
                Marquer comme lu
              </Button>
            )}
            {alert.isActive && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => resolveAlert(alert._id)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Résoudre
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => deleteAlert(alert._id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>
      )}
    </div>
  );
}