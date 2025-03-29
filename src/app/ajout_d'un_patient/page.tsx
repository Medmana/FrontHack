// src/app/Cpatients/page.tsx
'use client';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Head from 'next/head';

const patientSchema = z.object({
  personalInfo: z.object({
    lastName: z.string().min(2, "Minimum 2 caractères"),
    firstName: z.string().min(2, "Minimum 2 caractères"),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD"),
    gender: z.enum(['male', 'female', 'other']),
    bloodGroup: z.enum(['A', 'B', 'AB', 'O']),
    rhFactor: z.enum(['+', '-']),
    address: z.string().min(5),
    phone: z.string().regex(/^\d{10}$/, "Numéro à 10 chiffres")
  }),
  medicalData: z.object({
    medicalHistory: z.string().optional(),
    currentTreatments: z.array(z.object({
      medication: z.string().min(3, "Minimum 3 caractères"),
      dosage: z.string().min(1, "Requis"),
      frequency: z.string().min(1, "Requis")
    })),
    symptoms: z.object({
      description: z.string().min(10, "Description trop courte"),
      onsetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD"),
      severity: z.enum(['léger', 'modéré', 'sévère'])
    }),
    examinations: z.object({
      clinical: z.string().min(10, "Minimum 10 caractères"),
      biological: z.string().optional()
    })
  }),
  diagnosis: z.object({
    provisional: z.string().min(5),
    confirmed: z.string().optional()
  }),
  followUp: z.object({
    nextVisit: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD"),
    recommendations: z.string().min(10)
  }),
  administrativeData: z.object({
    fileNumber: z.string().min(3, "Minimum 3 caractères"),
    referringDoctor: z.string().min(2)
  })
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function PatientRegistrationForm() {
  const { 
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      medicalData: {
        currentTreatments: [{
          medication: '',
          dosage: '',
          frequency: ''
        }]
      }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicalData.currentTreatments"
  });

  const onSubmit = (data: PatientFormData) => {
    console.log("Dossier patient soumis:", data);
    // Envoyer les données à l'API
  };

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8 font-['Poppins']">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-10">
            <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">Dossier Patient Complet</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Informations Personnelles */}
              <section className="border-2 border-blue-100/50 bg-white/50 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">Informations Personnelles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom*</label>
                    <input
                      {...register("personalInfo.lastName")}
                      className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                    />
                    {errors.personalInfo?.lastName && (
                      <p className="mt-1 text-sm text-red-500">{errors.personalInfo.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom*</label>
                    <input
                      {...register("personalInfo.firstName")}
                      className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                    />
                    {errors.personalInfo?.firstName && (
                      <p className="mt-1 text-sm text-red-500">{errors.personalInfo.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de Naissance*</label>
                    <input
                      type="date"
                      {...register("personalInfo.birthDate")}
                      className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                    />
                    {errors.personalInfo?.birthDate && (
                      <p className="mt-1 text-sm text-red-500">{errors.personalInfo.birthDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sexe*</label>
                    <select
                      {...register("personalInfo.gender")}
                      className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                    >
                      <option value="male">Masculin</option>
                      <option value="female">Féminin</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Groupe Sanguin*</label>
                    <select
                      {...register("personalInfo.bloodGroup")}
                      className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                      <option value="O">O</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facteur Rhésus*</label>
                    <select
                      {...register("personalInfo.rhFactor")}
                      className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                    >
                      <option value="+">Rh+</option>
                      <option value="-">Rh-</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse*</label>
                    <input
                      {...register("personalInfo.address")}
                      className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                    />
                    {errors.personalInfo?.address && (
                      <p className="mt-1 text-sm text-red-500">{errors.personalInfo.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone*</label>
                    <input
                      {...register("personalInfo.phone")}
                      className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                    />
                    {errors.personalInfo?.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.personalInfo.phone.message}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Antécédents Médicaux */}
              <section className="border-2 border-blue-100/50 bg-white/50 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">Antécédents Médicaux</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Antécédents</label>
                  <textarea
                    {...register("medicalData.medicalHistory")}
                    rows={3}
                    className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                  />
                </div>
              </section>

              {/* Symptômes Actuels */}
              <section className="border-2 border-blue-100/50 bg-white/50 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">Symptômes Actuels</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                    <textarea
                      {...register("medicalData.symptoms.description")}
                      rows={4}
                      className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                    />
                    {errors.medicalData?.symptoms?.description && (
                      <p className="mt-1 text-sm text-red-500">{errors.medicalData.symptoms.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date d'apparition*</label>
                      <input
                        type="date"
                        {...register("medicalData.symptoms.onsetDate")}
                        className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sévérité*</label>
                      <select
                        {...register("medicalData.symptoms.severity")}
                        className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                      >
                        <option value="léger">Léger</option>
                        <option value="modéré">Modéré</option>
                        <option value="sévère">Sévère</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* Examens */}
              <section className="border-2 border-blue-100/50 bg-white/50 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">Examens Cliniques et Biologiques</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Examen Clinique*</label>
                    <textarea
                      {...register("medicalData.examinations.clinical")}
                      rows={4}
                      className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Résultats Biologiques</label>
                    <textarea
                      {...register("medicalData.examinations.biological")}
                      rows={3}
                      className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                    />
                  </div>
                </div>
              </section>

              {/* Traitements en Cours */}
              <section className="border-2 border-blue-100/50 bg-white/50 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">Traitements en Cours</h2>
                
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Médicament*</label>
                      <input
                        {...register(`medicalData.currentTreatments.${index}.medication`)}
                        className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                      />
                      {errors.medicalData?.currentTreatments?.[index]?.medication && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.medicalData.currentTreatments[index]?.medication?.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dosage*</label>
                      <input
                        {...register(`medicalData.currentTreatments.${index}.dosage`)}
                        className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence*</label>
                      <input
                        {...register(`medicalData.currentTreatments.${index}.frequency`)}
                        className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                      />
                    </div>
                    
                    <div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => append({ medication: '', dosage: '', frequency: '' })}
                  className="mt-2 flex items-center px-4 py-2.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Ajouter un médicament
                </button>
              </section>

              {/* Diagnostic */}
              <section className="border-2 border-blue-100/50 bg-white/50 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">Diagnostic</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnostic Provisoire*</label>
                    <input
                      {...register("diagnosis.provisional")}
                      className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnostic Confirmé</label>
                    <input
                      {...register("diagnosis.confirmed")}
                      className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                    />
                  </div>
                </div>
              </section>

              {/* Suivi */}
              <section className="border-2 border-blue-100/50 bg-white/50 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">Suivi et Recommandations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prochaine Visite*</label>
                    <input
                      type="date"
                      {...register("followUp.nextVisit")}
                      className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recommandations*</label>
                    <textarea
                      {...register("followUp.recommendations")}
                      rows={4}
                      className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                    />
                  </div>
                </div>
              </section>

              {/* Données Administratives */}
              <section className="border-2 border-blue-100/50 bg-white/50 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">Données Administratives</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de Dossier*</label>
                    <input
                      {...register("administrativeData.fileNumber")}
                      className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Médecin Référent*</label>
                    <input
                      {...register("administrativeData.referringDoctor")}
                      className="mt-1 block w-full border-2 border-blue-100 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200"
                    />
                  </div>
                </div>
              </section>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  className="px-6 py-3 border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-colors shadow-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Enregistrer le Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}