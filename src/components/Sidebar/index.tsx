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
} from 'lucide-react';

const Sidebar = ({ patientId }: { patientId: string }) => {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname.startsWith(path);

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