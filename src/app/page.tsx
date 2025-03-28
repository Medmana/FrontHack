'use client';
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false); // Pour gérer l'affichage du mot de passe

  // Fonction pour basculer la visibilité du mot de passe
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Head>
        <title>Connexion - LaboConnect</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <div className="max-w-4xl w-full flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Section Inscription */}
          <div className="w-full md:w-1/2 p-6 bg-blue-600 text-white">
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 mb-8"> {/* Augmentation de la taille */}
                <Image
                  src="/images/doctor.jpg"
                  alt="Doctor"
                  fill
                  className="rounded-full object-cover"
                  priority
                  sizes="(max-width: 768px) 160px, 160px" // Ajustement des breakpoints
                />
              </div>
              <h1 className="text-3xl font-semibold">AI4CKD</h1>
              <p className="mt-4">Pour une meilleure gestion.</p>
            </div>
          </div>

          {/* Section Connexion */}
          <div className="w-full md:w-1/2 p-6">
            <h2 className="text-lg font-semibold text-center text-blue-600">J’accède à mon compte</h2>
            <form className="mt-4 space-y-6">
              <div className="relative">
                <label className="absolute left-3 -top-4 text-sm font-medium text-gray-600 transition-all duration-200">
                  Identifiant*
                </label>
                <input
                  type="text"
                  placeholder="ex : Dominique"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 mt-6"
                />
              </div>

              <div className="relative">
                <label className="absolute left-3 -top-4 text-sm font-medium text-gray-600 transition-all duration-200">
                  Mot De Passe*
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="ex : @LaboConnect2015"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 mt-6"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12c0 3.866-3.134 7-7 7s-7-3.134-7-7 3.134-7 7-7 7 3.134 7 7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.828 13.828a4 4 0 10-5.656-5.656"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Checkbox pour afficher le mot de passe */}
              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="checkbox"
                  id="show-password"
                  checked={showPassword}
                  onChange={togglePasswordVisibility}
                  className="h-4 w-4"
                />
                <label htmlFor="show-password" className="text-sm">Afficher le mot de passe</label>
              </div>

              {/* Bouton de connexion */}
              <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                Se connecter
              </button>
            </form>

            {/* Lien mot de passe oublié */}
            <div className="mt-4 text-sm text-center">
              <a href="#" className="text-blue-600">J’ai oublié mon mot de passe ?</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;