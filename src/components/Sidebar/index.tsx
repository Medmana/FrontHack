
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
const Sidebar= () => {
  const pathname = usePathname();
 
  return (
    <div className="flex justify-right items-start py-16 md:py-20 lg:py-28 shadow-two duration-300 hover:shadow-one dark:bg-dark dark:shadow-three dark:hover:shadow-gray-dark relative z-10 min-h-screen bg-gradient-to-b ">

      {/* Navigation */}
      <nav className="mt-6">
        <ul className="space-y-4 text-blue-600 font-medium">
        <NavItem 
            label="Antécédents médicaux"
            href="/afficher_dossier/antecedent"
            isActive={pathname === '/afficher_dossier/antecedent'}
          />
          <NavItem  label="Traitement en cours"
          href="/patient/medical-history"
          isActive={pathname === '/patient/medical-history'} />
          <NavItem  label="Prescriptions" 
          href="/patient/medical-history"
          isActive={pathname === '/patient/medical-history'} />
          <NavItem  label="Voir les examens et résultats" 
          href="/patient/medical-history"
          isActive={pathname === '/patient/medical-history'}/>
          <NavItem  label="Demande d'examen" 
          href="/patient/medical-history"
          isActive={pathname === '/patient/medical-history'}/>
          <NavItem  label="Modifier les infos personnelles"
          href="/patient/medical-history"
          isActive={pathname === '/patient/medical-history'} />
        </ul>
        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          Supprimer le dossier
        </button>
      </nav>
    </div>
  );
}

// Composant réutilisable pour les éléments du menu
function NavItem({ label, badge, href, isActive }: {  label: string; badge?: string; href?: string; isActive?: boolean }) {
  return (
    <li className="flex items-center space-x-3 px-3 py-2 hover:bg-blue-50 rounded-md cursor-pointer">
      
      <Link 
        href={href}
        className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
          isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50'
        }`}
      >
        <span>{label}</span>
      </Link>
    </li>
  );
};
export default Sidebar;
