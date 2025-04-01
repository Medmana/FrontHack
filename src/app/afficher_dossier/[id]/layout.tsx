import { ReactNode } from "react";
import ProfileCard from "@/components/Profile";
import Sidebar from "@/components/Sidebar";

interface PatientData {
  id: string;
}

export default function PatientLayout({ 
  children,
  params 
}: { 
  children: ReactNode,
  params: { id: string }
}) {
  return (
    <div >
      
      <aside className="w-64 bg-white shadow-md fixed h-full">
        <Sidebar patientId={params.id} />
      </aside>

      {/* Contenu Principal */}
      <main className="ml-64">
        {/* ProfileCard en haut */}
        <section >
          <ProfileCard  />
        </section>
 
          {children}
  
      </main>
    </div>
  );
}
