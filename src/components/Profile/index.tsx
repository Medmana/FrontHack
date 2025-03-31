"use client";
const ProfileCard= () => {
  return (
    <div className="justify-center items-start py-16 md:py-20 shadow-two duration-300 hover:shadow-one dark:bg-dark dark:shadow-three dark:hover:shadow-gray-dark">
      <div className="bg-blue-500 text-white p-6 rounded-2xl flex items-center space-x-6 w-[1200px]">
        {/* Partie gauche - Photo et informations basiques */}
        <div className="relative flex flex-col items-center w-1/4">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-gray-200 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-16 h-16 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14c3.866 0 7 3.134 7 7M5 21c0-3.866 3.134-7 7-7m0-4a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">Manasse KOFFI</h2>
            <p className="text-lg">35 ans</p>
            <p className="text-lg">Masculin</p>
          </div>
        </div>

        {/* Partie centrale - Informations médicales */}
        <div className="w-2/4 px-8 border-l-2 border-r-2 border-blue-400 border-opacity-50">
        <h3 className="text-xl font-semibold mb-4">Dossier numero 13</h3>
          <h3 className="text-xl font-semibold mb-4">Informations Médicales</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Groupe Sanguin:</p>
              <p>O+</p>
            </div>
            <div>
              <p className="font-medium">Taille:</p>
              <p>1m75</p>
            </div>
            <div>
              <p className="font-medium">Poids:</p>
              <p>72kg</p>
            </div>
            <div>
              <p className="font-medium">Maladies Chroniques:</p>
              <p>Hypertension</p>
            </div>
          </div>
        </div>

        {/* Partie droite - Contact et localisation */}
        <div className="w-1/4 pl-6">
          <h3 className="text-xl font-semibold mb-4">Contact</h3>
          <div className="space-y-3">
            <div>
              <p className="font-medium">Téléphone:</p>
              <p>+229 01 89 45 12 34</p>
            </div>
            <div>
              <p className="font-medium">Email:</p>
              <p>manasse.koffi@example.com</p>
            </div>
            <div>
              <p className="font-medium">Adresse:</p>
              <p>Rue des Jardins, Coco</p>
              <p>Benin, Akassato</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileCard;