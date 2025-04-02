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
  Trash2
} from 'lucide-react';

const Sidebar = ({ patientId }: { patientId: string }) => {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname.startsWith(path);

  const navItems = [
    {
      icon: <History className="w-5 h-5 text-purple-600" />,
      label: "Antécédents médicaux",
      href: `/afficher_dossier/${patientId}/antecedent`,
    },
    {
      icon: <Pill className="w-5 h-5 text-blue-500" />,
      label: "Traitement en cours",
      href: `/afficher_dossier/${patientId}/traitement`,
    },
    {
      icon: <ClipboardList className="w-5 h-5 text-green-600" />,
      label: "Prescriptions", 
      href: `/afficher_dossier/${patientId}/prescription`,
    },
    {
      icon: <FileSearch className="w-5 h-5 text-orange-500" />,
      label: "Examens et résultats", 
      href: `/patients/${patientId}/examens`,
    },
    {
      icon: <FilePlus className="w-5 h-5 text-red-500" />,
      label: "Demande d'examen", 
      href: `/patients/${patientId}/demandes-examen`,
    },
    {
      icon: <UserCircle className="w-5 h-5 text-indigo-600" />,
      label: "Informations personnelles",
      href: `/patients/${patientId}/informations`,
    }
  ];

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 shadow-sm relative z-10 py-16 md:py-20 lg:py-28">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={isActive(item.href)}
            />
          ))}
        </ul>

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
            <Trash2 className="w-5 h-5" />
            <span>Supprimer le dossier</span>
          </button>
        </div>
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
        <span className={`${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {icon}
        </span>
        <span>{label}</span>
      </Link>
    </li>
  );
};

export default Sidebar;