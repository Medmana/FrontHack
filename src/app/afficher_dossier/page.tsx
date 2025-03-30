import React from "react";

const MedicalRecord = ({ data }) => {
  return (
    <div className="rounded-sm bg-white p-8 shadow-two duration-300 hover:shadow-one dark:bg-dark dark:shadow-three dark:hover:shadow-gray-dark lg:px-5 xl:px-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Dossier Médical numéro
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <p className="text-lg font-bold text-dark dark:text-white">Nom :</p>
        <p className="text-sm text-gray-600 dark:text-gray-300"></p>

        <p className="text-lg font-bold text-dark dark:text-white">Prénom :</p>
        <p className="text-sm text-gray-600 dark:text-gray-300"></p>

        <p className="text-lg font-bold text-dark dark:text-white">Date de naissance :</p>
        <p className="text-sm text-gray-600 dark:text-gray-300"></p>

        <p className="text-lg font-bold text-dark dark:text-white">Sexe :</p>
        <p className="text-sm text-gray-600 dark:text-gray-300"></p>

        <p className="text-lg font-bold text-dark dark:text-white">Groupe sanguin :</p>
        <p className="text-sm text-gray-600 dark:text-gray-300"></p>

        <p className="text-lg font-bold text-dark dark:text-white">Facteur Rh :</p>
        <p className="text-sm text-gray-600 dark:text-gray-300"></p>

        <p className="text-lg font-bold text-dark dark:text-white">Adresse :</p>
        <p className="text-sm text-gray-600 dark:text-gray-300"></p>

        <p className="text-lg font-bold text-dark dark:text-white">Téléphone :</p>
        <p className="text-sm text-gray-600 dark:text-gray-300"></p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
      <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">
          Antécédents médicaux
        </button>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">
          Traitement en cours
        </button>
        <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded">
          Prescriptions
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Voir les examens et résultats
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Demande d'examen
        </button>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
          Modifier les infos personnelles
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          Supprimer le dossier
        </button>
      </div>
    </div>
  );
};

export default MedicalRecord;