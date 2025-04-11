'use client';
import { PlusCircle, AlertCircle, CheckCircle, Edit, Trash2, Printer } from "lucide-react";
import { useEffect, useState, ChangeEvent } from "react";
import { useParams } from "next/navigation";
import { useRole } from '../../../../hooks/useRole';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Prescription {
  _id: string;
  medications: Medication[];
  expirationDate: string;
  notes: string;
  date: string;
  isActive: boolean;
  doctorId?: {
    firstName: string;
    lastName: string;
  };
}

export default function PrescriptionsList() {
  const params = useParams();
  const patientId = params?.id || params?.patientId;
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState<Prescription | null>(null);
  const [formData, setFormData] = useState({
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    expirationDate: '',
    notes: ''
  });

  useEffect(() => {
    if (patientId) {
      fetchPrescriptions();
    }
  }, [patientId]);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch(`https://backhack-production.up.railway.app/api/prescription/patients/${patientId}/prescriptions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur lors de la récupération');
      
      const { data } = await response.json();
      setPrescriptions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
    index?: number
  ) => {
    const { name, value } = e.target;
    
    if (index !== undefined && name.includes('medications')) {
      const meds = [...formData.medications];
      const field = name.split('.')[2]; // Get the field name (name, dosage, etc.)
      meds[index] = { ...meds[index], [field]: value };
      setFormData({ ...formData, medications: meds });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addMedicationField = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    });
  };

  const removeMedicationField = (index: number) => {
    const meds = [...formData.medications];
    meds.splice(index, 1);
    setFormData({ ...formData, medications: meds });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://backhack-production.up.railway.app/api/prescription/patients/${patientId}/prescriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Échec de la création');
      
      fetchPrescriptions();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://backhack-production.up.railway.app/api/prescription/${currentPrescription?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Échec de la modification');
      
      fetchPrescriptions();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setCurrentPrescription(null);
    setFormData({
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
      expirationDate: '',
      notes: ''
    });
  };

  const handleEdit = (prescription: Prescription) => {
    setCurrentPrescription(prescription);
    setShowForm(true);
    setFormData({
      medications: prescription.medications,
      expirationDate: prescription.expirationDate?.split('T')[0] || '',
      notes: prescription.notes || ''
    });
  };

  const handleNewPrescription = () => {
    setCurrentPrescription(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette prescription ?')) return;
    
    try {
      const response = await fetch(`https://backhack-production.up.railway.app/api/prescription/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Échec de la suppression');
      
      fetchPrescriptions();
    } catch (err) {
      setError(err.message);
    }
  };

  const printPrescription = (prescription: Prescription) => {
    // Implémentez la logique d'impression ici
    console.log('Impression de la prescription:', prescription);
  };
  const isauth = useRole('doctor');
  
  if (!isauth) return null;
  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Erreur: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex justify-between items-center bg-blue-700 text-white p-4">
        <h2 className="text-lg font-semibold">Prescriptions</h2>
        <button 
          onClick={handleNewPrescription}
          className="p-2 hover:bg-blue-600 rounded-full"
        >
          <PlusCircle size={24} />
        </button>
      </div>

      {showForm && (
        <div className="p-4 border-b">
          <form onSubmit={currentPrescription ? handleUpdate : handleCreate}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <h3 className="font-bold">Médicaments</h3>
              {formData.medications.map((med, index) => (
                <div key={index} className="border p-3 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom</label>
                      <input
                        type="text"
                        name={`medications.${index}.name`}
                        value={med.name}
                        onChange={(e) => handleInputChange(e, index)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dosage</label>
                      <input
                        type="text"
                        name={`medications.${index}.dosage`}
                        value={med.dosage}
                        onChange={(e) => handleInputChange(e, index)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fréquence</label>
                      <input
                        type="text"
                        name={`medications.${index}.frequency`}
                        value={med.frequency}
                        onChange={(e) => handleInputChange(e, index)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Durée</label>
                      <input
                        type="text"
                        name={`medications.${index}.duration`}
                        value={med.duration}
                        onChange={(e) => handleInputChange(e, index)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Instructions</label>
                    <input
                      type="text"
                      name={`medications.${index}.instructions`}
                      value={med.instructions}
                      onChange={(e) => handleInputChange(e, index)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  {formData.medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicationField(index)}
                      className="mt-2 text-red-500 text-sm"
                    >
                      Supprimer ce médicament
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addMedicationField}
                className="text-blue-500 text-sm"
              >
                + Ajouter un autre médicament
              </button>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date d'expiration</label>
                  <input
                    type="date"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {currentPrescription ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-4">
        <h3 className="text-blue-600 font-semibold border-b pb-2">PRESCRIPTIONS ACTIVES</h3>
        <ul className="mt-2 space-y-4">
          {prescriptions.filter(p => p.isActive).map((prescription) => (
            <li key={prescription._id} className="group border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">
                    {new Date(prescription.date).toLocaleDateString('fr-FR')} - 
                    Expire le {new Date(prescription.expirationDate).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    Prescrit par Dr. {prescription.doctorId?.firstName} {prescription.doctorId?.lastName}
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(prescription)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => printPrescription(prescription)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <Printer size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(prescription._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <ul className="mt-2 space-y-2">
                {prescription.medications.map((med, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium">{med.name}</span> - {med.dosage} ({med.frequency}, {med.duration})
                    {med.instructions && <div className="text-gray-500">Note: {med.instructions}</div>}
                  </li>
                ))}
              </ul>
              
              {prescription.notes && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Notes: </span>{prescription.notes}
                </div>
              )}
            </li>
          ))}
        </ul>

        <h3 className="text-gray-600 font-semibold border-b pb-2 mt-6">PRESCRIPTIONS ARCHIVÉES</h3>
        <ul className="mt-2 space-y-4">
          {prescriptions.filter(p => !p.isActive).map((prescription) => (
            <li key={prescription._id} className="border rounded-lg p-4 bg-gray-50">
              <div className="text-gray-500">
                {new Date(prescription.date).toLocaleDateString('fr-FR')} - 
                Expirée le {new Date(prescription.expirationDate).toLocaleDateString('fr-FR')}
              </div>
              <ul className="mt-1 space-y-1">
                {prescription.medications.map((med, index) => (
                  <li key={index} className="text-sm text-gray-500">
                    {med.name} - {med.dosage}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}