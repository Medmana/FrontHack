'use client';
import { useState } from 'react';
import { useRole } from '../../hooks/useRole'

const Creer_dossier = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    bloodGroup: '',
    rhFactor: '',
    height: '',
    weight: '',
    diseases: { name: '', stage: '', diagnosisDate: '' },
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'Bénin'
    },
    phone: '',
    email: '',
    fileNumber: `PAT${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleDiseasesChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      diseases: {
        ...prev.diseases,
        [name]: value
      }
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Combiner bloodGroup et rhFactor
      const completeBloodGroup = formData.bloodGroup + formData.rhFactor;
      
      const payload = {
        ...formData,
        bloodGroup: completeBloodGroup,
        // Convertir les strings vides en null pour les champs optionnels
        email: formData.email || null,
        height: formData.height ? Number(formData.height) : null,
        weight: formData.weight ? Number(formData.weight) : null,
      };

      const response = await fetch('http://localhost:3000/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création du dossier');
      }

      const result = await response.json();
      alert('Dossier créé avec succès! Numéro de dossier: ' + result.fileNumber);

      window.location.href = '/afficher_dossier/' + result._id; // Rediriger vers la page d'affichage du dossier
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };
   const isauth = useRole('doctor')
    
    if (!isauth) return null
  

    return (
      <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
              <div className="mb-12 rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
                <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                  Créer un nouveau dossier médical
                </h2>
                <p className="mb-12 text-base font-medium text-body-color">
                  Veuillez remplir tous les champs obligatoires.
                </p>
                
                {error && (
                  <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    {error}
                  </div>
                )}
  
                {success && (
                  <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                    {success}
                  </div>
                )}
  
                <form onSubmit={handleSubmit}>
                  <div className="-mx-4 flex flex-wrap">
                    {/* Nom et Prénom */}
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label htmlFor="lastName" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          Nom *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        />
                      </div>
                    </div>
  
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label htmlFor="firstName" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        />
                      </div>
                    </div>
  
                    {/* Date de naissance et Genre */}
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label htmlFor="birthDate" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          Date de naissance *
                        </label>
                        <input
                          type="date"
                          id="birthDate"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleChange}
                          required
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        />
                      </div>
                    </div>
  
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label htmlFor="gender" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          Genre *
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        >
                          <option value="">Sélectionnez...</option>
                          <option value="male">Homme</option>
                          <option value="female">Femme</option>
                          <option value="other">Autre</option>
                        </select>
                      </div>
                    </div>
  
                    {/* Groupe sanguin et Rhésus */}
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label htmlFor="bloodGroup" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          Groupe sanguin *
                        </label>
                        <select
                          id="bloodGroup"
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleChange}
                          required
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        >
                          <option value="">Sélectionnez...</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                    </div>
  
                    {/* Taille et Poids */}
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label htmlFor="height" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          Taille (cm)
                        </label>
                        <input
                          type="number"
                          id="height"
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          min="0"
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        />
                      </div>
                    </div>
  
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label htmlFor="weight" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          Poids (kg)
                        </label>
                        <input
                          type="number"
                          id="weight"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          min="0"
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        />
                      </div>
                    </div>
  
                    {/* Maladies */}
                    <div className="w-full px-4">
                      <h3 className="mb-4 text-lg font-medium text-dark dark:text-white">
                        Informations sur les maladies
                      </h3>
                    </div>
  
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label htmlFor="diseaseName" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          Nom de la maladie *
                        </label>
                        <input
                          type="text"
                          id="diseaseName"
                          name="name"
                          value={formData.diseases.name}
                          onChange={handleDiseasesChange}
                          required
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        />
                      </div>
                    </div>
  
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label htmlFor="diseaseStage" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          Stade de la maladie *
                        </label>
                        <select
                          id="diseaseStage"
                          name="stage"
                          value={formData.diseases.stage}
                          onChange={handleDiseasesChange}
                          required
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        >
                          <option value="">Sélectionnez...</option>
                          <option value="débutant">Débutant</option>
                          <option value="intermédiaire">Intermédiaire</option>
                          <option value="avancé">Avancé</option>
                          <option value="chronique">Chronique</option>
                        </select>
                      </div>
                    </div>
  
                    <div className="w-full px-4">
                      <div className="mb-8">
                        <label htmlFor="diagnosisDate" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          Date de diagnostic *
                        </label>
                        <input
                          type="date"
                          id="diagnosisDate"
                          name="diagnosisDate"
                          value={formData.diseases.diagnosisDate}
                          onChange={handleDiseasesChange}
                          required
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        />
                      </div>
                    </div>
  
                    {/* Adresse */}
                    <div className="w-full px-4">
                      <h3 className="mb-4 text-lg font-medium text-dark dark:text-white">
                        Adresse
                      </h3>
                    </div>
  
                    <div className="w-full px-4">
                      <div className="mb-8">
                        <label htmlFor="street" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          Rue *
                        </label>
                        <input
                          type="text"
                          id="street"
                          name="street"
                          value={formData.address.street}
                          onChange={handleAddressChange}
                          required
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        />
                      </div>
                    </div>
  
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label htmlFor="city" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          Ville *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.address.city}
                          onChange={handleAddressChange}
                          required
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        />
                      </div>
                    </div>
  
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label htmlFor="country" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          Pays *
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={formData.address.country}
                          onChange={handleAddressChange}
                          required
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        />
                      </div>
                    </div>
  
                    {/* Contact */}
                    <div className="w-full px-4">
                      <h3 className="mb-4 text-lg font-medium text-dark dark:text-white">
                        Contact
                      </h3>
                    </div>
  
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label htmlFor="phone" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+229XXXXXXXX"
                          pattern="\+229\d{10}"
                          required
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Format: +229XXXXXXXX</p>
                      </div>
                    </div>
  
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label htmlFor="email" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        />
                      </div>
                    </div>

                  {/* Bouton de soumission */}
                  <div className="w-full px-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          En cours...
                        </>
                      ) : 'Créer le dossier'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
              <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            {/* Vous pouvez ajouter du contenu supplémentaire ici si nécessaire */}
          </div>
        </div>
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

export default Creer_dossier;