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
    diseases,
    attendingDoctorName
  } = patient;

  const genderLabel = {
    male: 'Homme',
    female: 'Femme',
    other: 'Autre'
  }[gender];

  return (
    <div className="w-full">
      <div className="rounded-sm bg-white p-8 shadow-two duration-300 hover:shadow-one dark:bg-dark dark:shadow-three dark:hover:shadow-gray-dark lg:px-5 xl:px-8">
        {/* En-tête avec photo et info basique */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600">
            {firstName.charAt(0)}{lastName.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-dark dark:text-white">
              {firstName} {lastName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {age} ans • {genderLabel}
              {bloodGroup && ` • ${bloodGroup}`}
            </p>
          </div>
        </div>

        {/* Détails médicaux */}
        <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium text-gray-500 dark:text-gray-400">Dossier:</span>
            <p className="text-dark dark:text-white">{fileNumber}</p>
          </div>
          
          {diseases?.length > 0 && (
            <div className="col-span-2">
              <span className="font-medium text-gray-500 dark:text-gray-400">Maladies:</span>
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
            <div className="col-span-2">
              <span className="font-medium text-gray-500 dark:text-gray-400">Médecin:</span>
              <p className="text-dark dark:text-white">{attendingDoctorName}</p>
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