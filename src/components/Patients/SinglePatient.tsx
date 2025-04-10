import { Patient } from "@/types/patient";
import Link from "next/link";

const SinglePatient = ({ patient }: { patient: Patient }) => {
  const { 
    _id,
    firstName,
    lastName,
    age,
    gender,
    bloodGroup,
    fileNumber,
    diseases = [],
    attendingDoctorName
  } = patient;

  const genderLabel = {
    male: 'Homme',
    female: 'Femme',
    other: 'Autre'
  }[gender];

  return (
    <div className="w-full">
       <div className="min-h-80 rounded-lg bg-white p-5 shadow-md hover:shadow-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-all duration-200 flex flex-col">
        {/* En-tête avec photo et info basique */}
        <div className="flex items-start gap-4 mb-3">
        <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 text-blue-600 font-bold text-lg border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30">
            {firstName.charAt(0)}{lastName.charAt(0)}
          </div>
          <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-1">
              {firstName} {lastName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
              {age} ans • {genderLabel}
              {bloodGroup && ` • ${bloodGroup}`}
            </p>
          </div>
        </div>
        <div className="h-px bg-gray-200 dark:bg-gray-700 my-3"></div>
        {/* Détails médicaux */}
        <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
        {fileNumber && (
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Numéro de dossier
              </span>
              <p className="text-gray-800 dark:text-white line-clamp-1">{fileNumber}</p>
            </div>
          )}
          
          {diseases?.length > 0 && (
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Maladies:</span>
              <ul className="text-dark dark:text-white">
                {diseases.map((disease, index) => (
                  <li key={index}>
                    {disease.name}
                    {disease.stage && ` (${disease.stage})`}
                  </li>
                ))}
              </ul>
            </div>
          )}

{attendingDoctorName && (
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Médecin traitant
              </span>
              <p className="text-gray-800 dark:text-white line-clamp-1">{attendingDoctorName}</p>
            </div>
          )}
        </div>

        <Link 
          href={`/afficher_dossier/${_id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Voir le dossier complet →
        </Link>
      </div>
    </div>
  );
};

export default SinglePatient;