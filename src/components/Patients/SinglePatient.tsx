import { Patient } from "@/types/patient";

const SinglePatient = ({ patient }: { patient: Patient }) => {
  const { id, name, age, diseaseStage, lastVisit, doctor, treatment } = patient;

  return (
    <div className="w-full">
       <div className="rounded-sm bg-white p-8 shadow-two duration-300 hover:shadow-one dark:bg-dark dark:shadow-three dark:hover:shadow-gray-dark lg:px-5 xl:px-8">
        {/* En-tête avec photo et info basique */}
        <div className="flex items-start gap-4 mb-4">
          
          <div>
            <h3 className="text-lg font-bold text-dark dark:text-white">{name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{age} ans</p>
          </div>
        </div>

        {/* Détails médicaux */}
        <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
        <div>
            <span className="font-medium text-gray-500 dark:text-gray-400">Dossier Num:</span>
            <p className="text-dark dark:text-white">{id}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500 dark:text-gray-400">Dernière visite:</span>
            <p className="text-dark dark:text-white">{lastVisit}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500 dark:text-gray-400">Stade:</span>
            <p className="text-dark dark:text-white">{diseaseStage}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500 dark:text-gray-400">Traitement:</span>
            <p className="text-dark dark:text-white">{treatment || "Non spécifié"}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500 dark:text-gray-400">Médecin:</span>
            <p className="text-dark dark:text-white">{doctor}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePatient;