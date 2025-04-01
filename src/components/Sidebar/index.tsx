"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  History,
  Pill,
  ClipboardList,
  FileSearch,
  FilePlus,
  UserCircle,
  Trash2
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
 
  return (
    <div className="flex justify-right items-start py-16 md:py-20 lg:py-28 shadow-two duration-300 hover:shadow-one dark:bg-dark dark:shadow-three dark:hover:shadow-gray-dark relative z-10 min-h-screen bg-gradient-to-b">
      {/* Navigation */}
      <nav className="mt-6">
        <ul className="space-y-4 text-blue-600 font-medium">
          <NavItem 
            icon={<History className="w-8 h-9 text-purple-600" />}
            label="Antécédents médicaux"
            href="/afficher_dossier/antecedent"
            isActive={pathname === '/afficher_dossier/antecedent'}
          />
          <NavItem  
            icon={<Pill className="w-8 h-9 text-blue-500" />}
            label="Traitement en cours"
            href="/patient/medical-history"
            isActive={pathname === '/patient/medical-history'} 
          />
          <NavItem  
            icon={<ClipboardList className="w-8 h-9 text-green-600" />}
            label="Prescriptions" 
            href="/patient/medical-history"
            isActive={pathname === '/patient/medical-history'} 
          />
          <NavItem  
            icon={<FileSearch className="w-8 h-9 text-orange-500" />}
            label="Voir les examens et résultats" 
            href="/patient/medical-history"
            isActive={pathname === '/patient/medical-history'}
          />
          <NavItem  
            icon={<FilePlus className="w-8 h-9 text-red-500" />}
            label="Demande d'examen" 
            href="/patient/medical-history"
            isActive={pathname === '/patient/medical-history'}
          />
          <NavItem  
            icon={<UserCircle className="w-8 h-9 text-indigo-600" />}
            label="Modifier les infos personnelles"
            href="/patient/medical-history"
            isActive={pathname === '/patient/medical-history'} 
          />
        </ul>
        <button className="mt-0 flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          <Trash2 className="w-6 h-6 text-white" />
          <span>Supprimer le dossier</span>
        </button>
      </nav>
    </div>
  );
}

// Composant réutilisable pour les éléments du menu
function NavItem({ icon, label, badge, href, isActive }: { 
  icon: React.ReactNode;
  label: string; 
  badge?: string; 
  href?: string; 
  isActive?: boolean 
}) {
  return (
    <li className="flex items-center space-x-3 px-3 py-2 hover:bg-blue-50 rounded-md cursor-pointer">
      <Link 
        href={href}
        className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
          isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50'
        }`}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
};

export default Sidebar;