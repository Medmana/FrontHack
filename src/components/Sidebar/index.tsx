"use client";

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { 
  History,
  Pill,
  ClipboardList,
  FileSearch,
  FilePlus, 
  UserCircle,
  Trash2,
  CalendarCheck,
  Download
} from 'lucide-react';

const Sidebar = ({ patientId }: { patientId: string }) => {
  const pathname = usePathname();
  const token = localStorage.getItem('access_token');
  
  const isActive = (path: string) => pathname.startsWith(path);
  const handleDownloadDossier = async () => {
    try {
      // Appel à l'API pour générer le PDF
      const response = await fetch(`https://backhack-production.up.railway.app/api/patients/${patientId}/dossier`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf' // Si vous attendez un PDF en réponse
        }
      });
      
      if (!response.ok) throw new Error('Erreur lors de la génération du PDF');
      
      // Création du blob et téléchargement
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dossier-patient-${patientId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors du téléchargement');
    }
  };


  const navItems = [
    {
      icon: <History className="w-5 h-5 text-blue-500" />,
      label: "Antécédents médicaux",
      href: `/afficher_dossier/${patientId}/antecedent`,
    },
    {
      icon: <Pill className="w-5 h-5 text-blue-500" />,
      label: "Traitement en cours",
      href: `/afficher_dossier/${patientId}/traitement`,
    },
    {
      icon: <ClipboardList className="w-5 h-5 text-blue-500" />,
      label: "Prescriptions", 
      href: `/afficher_dossier/${patientId}/prescription`,
    },
    {
      icon: <FileSearch className="w-5 h-5 text-blue-500" />,
      label: "Examens et résultats", 
      href: `/afficher_dossier/${patientId}/exam`,
    },
    {
      icon: <CalendarCheck className="w-5 h-5 text-blue-500" />,
      label: "Consultations",
      href: `/afficher_dossier/${patientId}/consultation`,
    },
    {
      icon: <UserCircle className="w-5 h-5 text-blue-500" />,
      label: "Patient",
      href: `/afficher_dossier/${patientId}`,
    },
    {
      icon: <Download className="w-5 h-5 text-blue-500" />,
      label: "Télécharger le dossier",
      onClick: handleDownloadDossier,
    }
  ];

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 shadow-sm relative z-10 py-16 md:py-20 lg:py-28">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            item.href ? (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={isActive(item.href)}
              />
            ) : (
              <li key={item.label}>
                <button
                  onClick={item.onClick}
                  className="flex items-center space-x-3 p-3 rounded-lg transition-colors w-full text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <span className="text-blue-500 dark:text-blue-400">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              </li>
            )
          ))}
        </ul>
      </nav>
    </div>
  );
}

function NavItem({ 
  icon, 
  label, 
  href, 
  isActive 
}: { 
  icon: React.ReactNode;
  label: string; 
  href: string; 
  isActive: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-700 font-medium dark:bg-gray-700 dark:text-blue-400'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        <span className="text-blue-500 dark:text-blue-400">
          {icon}
        </span>
        <span>{label}</span>
      </Link>
    </li>
  );
};
export default Sidebar;