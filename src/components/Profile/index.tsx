"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: {  
    street?: string;
    city?: string;
    country?: string;
  };
  diseases: {  
    name?: string;
    stage?: string;
  };
  height: number;
  weight: number;
  bloodGroup: string;
  fileNumber: string;
}
const token = localStorage.getItem('access_token');

const ProfileCard = () => {
  const params = useParams();
  const patientId = params.id as string;
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/patients/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setPatient(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  if (!patient) {
    return <div className="text-center py-8">Aucune donnée patient disponible</div>;
  }

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-22 relative z-10">
      <div className="bg-white text-blue-800 dark:bg-gray-900 dark:text-white rounded-2xl shadow-xl overflow-hidden border border-blue-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row">
          {/* Partie gauche - Photo et identité */}
          <div className="p-2 md:p-2 flex flex-col items-center md:w-1/4 bg-white dark:bg-gray-800 border-r border-blue-200 dark:border-gray-700">
          <div className="w-28 h-28 bg-blue-800 dark:bg-white rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 text-blue-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center mb-1">
              {patient.firstName} {patient.lastName}
            </h2>
            <div className="flex space-x-4 mt-2">
              <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
                {patient.age} ans
              </span>
              <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
                {patient.gender}
              </span>
            </div>
          </div>

          {/* Partie centrale - Informations médicales */}
          <div className="p-3 md:p-3 md:w-2/4 border-t md:border-t-0 md:border-l border-blue-200 dark:border-gray-700">
 
 <h3 className="text-lg font-semibold mb-4">Informations Médicales</h3>
 <div className="grid grid-cols-2 gap-2">
   <div className="mb-6">

     <p className="text-blue-700 dark:text-gray-300 font-mono">N° dossier</p>
     <p className="font-medium">#{patient.fileNumber}</p>
   </div>
   <div>
     <p className="text-blue-600 dark:text-gray-400 text-sm">Groupe Sanguin</p>
     <p className="font-medium">{patient.bloodGroup || 'Non renseigné'}</p>
   </div>
   <div>
     <p className="text-blue-600 dark:text-gray-400 text-sm">Taille</p>
     <p className="font-medium">{patient.height ? `${patient.height} cm` : 'Non renseigné'}</p>
   </div>
   <div>
     <p className="text-blue-600 dark:text-gray-400 text-sm">Poids</p>
     <p className="font-medium">{patient.weight ? `${patient.weight} kg` : 'Non renseigné'}</p>
   </div>
   <div>
     <p className="text-blue-600 dark:text-gray-400 text-sm">Maladie</p>
     <p className="font-medium">{patient.diseases.name ? `${patient.diseases.name} ` : 'Non renseigné'}</p>
   </div>
   <div>
     <p className="text-blue-600 dark:text-gray-400 text-sm">stade</p>
     <p className="font-medium">{patient.diseases.stage ? `${patient.diseases.stage} ` : 'Non renseigné'}</p>
   </div>
 </div>
</div>

          {/* Partie droite - Contact */}
          <div className="p-6 md:p-8 md:w-1/4 border-t md:border-t-0 md:border-l border-blue-500 border-opacity-30">
            <h3 className="text-lg font-semibold mb-4">Coordonnées</h3>
            <div className="space-y-4">
              <div>
                <p className="text-blue-600 dark:text-gray-400 text-sm">Téléphone</p>
                <p className="font-medium">{patient.phone || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="text-blue-600 dark:text-gray-400 text-sm">Email</p>
                <p className="font-medium break-all">{patient.email || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="text-blue-600 dark:text-gray-400 text-sm">Adresse</p>
                <p className="font-medium">
    {patient.address?.street && `${patient.address.street}, `}
    {patient.address?.city}
    <br />
    {patient.address?.country || 'Bénin'}
  </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;