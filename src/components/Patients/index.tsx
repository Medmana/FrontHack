"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Patient } from "@/types/patient";
import SectionTitle from "../Common/SectionTitle";
import SinglePatient from "./SinglePatient";
import { useRole } from '../../hooks/useRole';
import { useEffect } from "react";
const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState<keyof Patient>("firstName");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Récupération des patients depuis l'API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('https://backhack-production.up.railway.app/api/patients', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Erreur réseau');
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Format de données invalide');
        
        setPatients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const getFieldLabel = (field: keyof Patient): string => {
    const labels: Record<keyof Patient, string> = {
      _id: "ID",
      firstName: "prénom",
      lastName: "nom",
      birthDate: "date de naissance",
      gender: "genre",
      bloodGroup: "groupe sanguin",
      height: "taille",
      weight: "poids",
      diseases: "maladies",
      address: "adresse",
      phone: "téléphone",
      email: "email",
      fileNumber: "numéro de dossier",
      attendingDoctor: "médecin traitant",
      attendingDoctorName: "médecin traitant",
      age: "âge",
      isActive: "statut",
      createdAt: "date de création",
      updatedAt: "date de modification"
    };
    return labels[field] || field.toString();
  };

  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients;

    const lowerCaseSearch = searchTerm.toLowerCase();

    return patients.filter(patient => {
      const fieldValue = patient[searchField];
      
      if (typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(lowerCaseSearch);
      } else if (typeof fieldValue === 'number') {
        return fieldValue.toString().includes(searchTerm);
      } else if (Array.isArray(fieldValue)) {
        // Recherche dans les maladies
        return fieldValue.some(disease => 
          disease.name.toLowerCase().includes(lowerCaseSearch)
    )}
      return false;
    });
  }, [searchTerm, searchField, patients]);

  const isauth = useRole('doctor');
  
  if (!isauth) return null;
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!Array.isArray(patients)) return <div>Format de données invalide</div>;

  return (
    <section className="dark:bg-bg-color-dark bg-gray-light relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Dossiers des Patients"
          paragraph=""
          center
        />
        <span className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">
        {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''}
      </span>
        
        <div className="flex flex-col items-center gap-6 justify-center pr-16 lg:pr-0">
          <Link
            href="/creer_dossier"
            className="flex items-center justify-center rounded-full bg-green-600 p-3 text-white shadow-md transition-all duration-300 hover:bg-green-700 hover:shadow-lg"
            title="Ajouter un Dossier"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
          <span className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-300">
            Ajouter un Dossier
          </span>
        </div>

        {/* Barre de recherche */}
        <div className="mb-10 w-full max-w-3xl mx-auto flex-1">
          <div className="flex justify-between items-center mb-6">
            <select
               className="w-10/3 p-2 border rounded-md dark:bg-gray-800 dark:text-white"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value as keyof Patient)}
            >
              <option value="firstName">Prénom</option>
              <option value="lastName">Nom</option>
              <option value="fileNumber">N° Dossier</option>
              <option value="bloodGroup">Groupe sanguin</option>
              <option value="diseases.name">Maladies</option>
              <option value="diseases.stage">Stade de maladie</option>
              <option value="attendingDoctorName">Médecin</option>
            </select>
            
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={`Rechercher par ${getFieldLabel(searchField)}...`}
                className="w-2/3 p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
             
            </div>
          </div>
        </div>

        {/* Résultats */}
        {filteredPatients.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {filteredPatients.map((patient) => (
              <SinglePatient key={patient._id} patient={patient} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-dark dark:text-white">
              Aucun patient ne correspond à votre recherche.
            </p>
          </div>
        )}
      </div>

      <div className="absolute right-0 top-5 z-[-1]">
        <svg
          width="238"
          height="531"
          viewBox="0 0 238 531"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.3"
            x="422.819"
            y="-70.8145"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(51.2997 422.819 -70.8145)"
            fill="url(#paint0_linear_83:2)"
          />
          <rect
            opacity="0.3"
            x="426.568"
            y="144.886"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(51.2997 426.568 144.886)"
            fill="url(#paint1_linear_83:2)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_83:2"
              x1="517.152"
              y1="-251.373"
              x2="517.152"
              y2="459.865"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_83:2"
              x1="455.327"
              y1="-35.673"
              x2="455.327"
              y2="675.565"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-5 left-0 z-[-1]">
        <svg
          width="279"
          height="106"
          viewBox="0 0 279 106"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.5">
            <path
              d="M-57 12L50.0728 74.8548C55.5501 79.0219 70.8513 85.7589 88.2373 79.3692C109.97 71.3821 116.861 60.9642 156.615 63.7423C178.778 65.291 195.31 69.2985 205.911 62.3533C216.513 55.408 224.994 47.7682 243.016 49.1572C255.835 50.1453 265.278 50.8936 278 45.3373"
              stroke="url(#paint0_linear_72:302)"
            />
            <path
              d="M-57 1L50.0728 63.8548C55.5501 68.0219 70.8513 74.7589 88.2373 68.3692C109.97 60.3821 116.861 49.9642 156.615 52.7423C178.778 54.291 195.31 58.2985 205.911 51.3533C216.513 44.408 224.994 36.7682 243.016 38.1572C255.835 39.1453 265.278 39.8936 278 34.3373"
              stroke="url(#paint1_linear_72:302)"
            />
            <path
              d="M-57 23L50.0728 85.8548C55.5501 90.0219 70.8513 96.7589 88.2373 90.3692C109.97 82.3821 116.861 71.9642 156.615 74.7423C178.778 76.291 195.31 80.2985 205.911 73.3533C216.513 66.408 224.994 58.7682 243.016 60.1572C255.835 61.1453 265.278 61.8936 278 56.3373"
              stroke="url(#paint2_linear_72:302)"
            />
            <path
              d="M-57 35L50.0728 97.8548C55.5501 102.022 70.8513 108.759 88.2373 102.369C109.97 94.3821 116.861 83.9642 156.615 86.7423C178.778 88.291 195.31 92.2985 205.911 85.3533C216.513 78.408 224.994 70.7682 243.016 72.1572C255.835 73.1453 265.278 73.8936 278 68.3373"
              stroke="url(#paint3_linear_72:302)"
            />
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_72:302"
              x1="256.267"
              y1="53.6717"
              x2="-40.8688"
              y2="8.15715"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_72:302"
              x1="256.267"
              y1="42.6717"
              x2="-40.8688"
              y2="-2.84285"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_72:302"
              x1="256.267"
              y1="64.6717"
              x2="-40.8688"
              y2="19.1572"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_72:302"
              x1="256.267"
              y1="76.6717"
              x2="-40.8688"
              y2="31.1572"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Patients;