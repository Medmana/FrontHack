'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Save, Edit, X, Trash2 } from 'lucide-react';
import { useRole } from '../../../hooks/useRole';

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
    name: string;
    stage: string;
    diagnosisDate: string | Date;
  };
  height: number;
  weight: number;
  bloodGroup: string;
  fileNumber: string;
}

export default function PatientProfile() {
  const params = useParams();
  const patientId = params.id as string;
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [editData, setEditData] = useState<Partial<PatientData>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://backhack-production.up.railway.app/api/patients/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        
        const data = await response.json();
        setPatient(data);
        setEditData({
          ...data,
          diseases: {
            name: data.diseases?.name || '',
            stage: data.diseases?.stage || '',
            diagnosisDate: data.diseases?.diagnosisDate || ''
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) fetchPatientData();
  }, [patientId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setEditData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else if (name.startsWith('diseases.')) {
      const field = name.split('.')[1];
      setEditData(prev => ({
        ...prev,
        diseases: {
          ...prev.diseases,
          [field]: field === 'diagnosisDate' ? new Date(value).toISOString() : value
        }
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      if (!editData.diseases?.name) {
        setError('Le nom de la maladie est obligatoire');
        return;
      }

      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://backhack-production.up.railway.app/api/patients/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) throw new Error('Échec de la mise à jour');

      const updatedPatient = await response.json();
      setPatient(updatedPatient);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        const response = await fetch(`https://backhack-production.up.railway.app/api/patients/${patientId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (!response.ok) throw new Error('Échec de la suppression');
  
        window.location.href = '/home';
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      } finally {
        setLoading(false);
      }
    }
  };

  const isauth = useRole('doctor');
  
  if (!isauth) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* En-tête avec boutons d'édition */}
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            {patient.firstName} {patient.lastName}
          </h1>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 bg-white text-blue-600 rounded-full hover:bg-blue-50"
                  title="Annuler"
                >
                  <X size={20} />
                </button>
                <button
                  onClick={handleSave}
                  className="p-2 bg-white text-blue-600 rounded-full hover:bg-blue-50"
                  title="Enregistrer"
                >
                  <Save size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-white text-blue-600 rounded-full hover:bg-blue-50"
                  title="Modifier"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                  title="Supprimer"
                >
                  <Trash2 size={20} /> 
                </button>
              </>
            )}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="p-6 space-y-6">
          {/* Section Identité */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">Identité</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={editData.firstName || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  <p className="p-2">{patient.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={editData.lastName || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  <p className="p-2">{patient.lastName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Âge</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={editData.age || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  <p className="p-2">{patient.age} ans</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={editData.gender || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Masculin">Masculin</option>
                    <option value="Féminin">Féminin</option>
                    <option value="Autre">Autre</option>
                  </select>
                ) : (
                  <p className="p-2">{patient.gender}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de dossier</label>
                <p className="p-2 font-mono">{patient.fileNumber}</p>
              </div>
            </div>
          </div>

          {/* Section Contact */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">Coordonnées</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  <p className="p-2">{patient.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  <p className="p-2">{patient.email}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      name="address.street"
                      value={editData.address?.street || ''}
                      onChange={handleInputChange}
                      placeholder="Rue"
                      className="w-full p-2 border rounded"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="address.city"
                        value={editData.address?.city || ''}
                        onChange={handleInputChange}
                        placeholder="Ville"
                        className="w-full p-2 border rounded"
                      />
                      <input
                        type="text"
                        name="address.country"
                        value={editData.address?.country || ''}
                        onChange={handleInputChange}
                        placeholder="Pays"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="p-2">
                    {patient.address?.street && `${patient.address.street}, `}
                    {patient.address?.city}
                    {patient.address?.country && `, ${patient.address.country}`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section Médicale */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Informations Médicales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Groupe Sanguin</label>
                {isEditing ? (
                  <select
                    name="bloodGroup"
                    value={editData.bloodGroup || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Sélectionner</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <p className="p-2">{patient.bloodGroup || 'Non renseigné'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taille (cm)</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="height"
                    value={editData.height || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  <p className="p-2">{patient.height || 'Non renseigné'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="weight"
                    value={editData.weight || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  <p className="p-2">{patient.weight || 'Non renseigné'}</p>
                )}
              </div>
            </div>

            {/* Section Maladie */}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Informations sur la maladie</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maladie*</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="diseases.name"
                      value={editData.diseases?.name || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  ) : (
                    <p className="p-2">{patient.diseases?.name || 'Non renseigné'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stade</label>
                  {isEditing ? (
                    <select
                      name="diseases.stage"
                      value={editData.diseases?.stage || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="débutant">Débutant</option>
                      <option value="intermédiaire">Intermédiaire</option>
                      <option value="avancé">Avancé</option>
                      <option value="chronique">Chronique</option>
                    </select>
                  ) : (
                    <p className="p-2">{patient.diseases?.stage || 'Non renseigné'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de diagnostic</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="diseases.diagnosisDate"
                      value={editData.diseases?.diagnosisDate ? new Date(editData.diseases.diagnosisDate as string).toISOString().split('T')[0] : ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    <p className="p-2">
                      {patient.diseases?.diagnosisDate ? new Date(patient.diseases.diagnosisDate as string).toLocaleDateString() : 'Non renseigné'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}