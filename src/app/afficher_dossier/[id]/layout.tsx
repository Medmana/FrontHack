import { ReactNode } from "react";
import ProfileCard from "@/components/Profile";
import Sidebar from "@/components/Sidebar";

export default async function PatientLayout({ 
  children,
  params 
}: { 
  children: ReactNode,
  params: Promise<{ id: string }> // Note the Promise wrapper
}) {
  // Await the params promise
  const { id } = await params;
  
  return (
    <div>
      <h3>{id}</h3>
      <aside className="w-64 bg-white shadow-md fixed h-full">
        <Sidebar patientId={id} /> {/* Use the resolved id */}
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        {/* ProfileCard at the top */}
        <section>
          <ProfileCard />
        </section>
        
        {children}
      </main>
    </div>
  );
}