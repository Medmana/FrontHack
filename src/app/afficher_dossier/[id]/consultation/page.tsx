'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Plus, Stethoscope, ChevronLeft, Calendar, ClipboardList, FileText } from 'lucide-react';
import { useRole } from '../../../../hooks/useRole';

interface Consultation {
  _id: string;
  date: Date;
  reason: string;
  observations: string;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  doctor: {
    firstName: string;
    lastName: string;
  };
  creatinineLevel?: number;
  gfr?: number;
  nextAppointment?: Date;
}

export default function ConsultationPage() {
  const params = useParams();
  const patientId = params?.id || params?.patientId;
  
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const isauth = useRole('doctor');
  
  if (!isauth) return null;
  
  // Form state
  const [formData, setFormData] = useState({
    reason: '',
    observations: '',
    systolic: '',
    diastolic: '',
    weight: '',
    height: '',
    creatinineLevel: '',
    gfr: '',
    nextAppointment: ''
  });

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        console.log("popo")
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://localhost:3000/api/consultations/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Erreur lors du chargement des consultations');
        
        const data = await response.json();
        setConsultations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) fetchConsultations();
  }, [patientId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      const consultationData = {
        reason: formData.reason,
        observations: formData.observations,
        bloodPressure: {
          systolic: Number(formData.systolic),
          diastolic: Number(formData.diastolic)
        },
        weight: Number(formData.weight),
        height: Number(formData.height),
        creatinineLevel: Number(formData.creatinineLevel),
        gfr: Number(formData.gfr),
        nextAppointment: formData.nextAppointment ? new Date(formData.nextAppointment) : undefined
      };

      const response = await fetch(`http://localhost:3000/api/consultations/${patientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(consultationData)
      });

      if (!response.ok) throw new Error('Erreur lors de la création de la consultation');

      const newConsultation = await response.json();
      setConsultations(prev => [newConsultation, ...prev]);
      setShowForm(false);
      setFormData({
        reason: '',
        observations: '',
        systolic: '',
        diastolic: '',
        weight: '',
        height: '',
        creatinineLevel: '',
        gfr: '',
        nextAppointment: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !showForm) {
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
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => window.history.back()} 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold flex items-center">
          <Stethoscope className="mr-2 text-indigo-600" />
          Consultations du patient
        </h1>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus size={18} className="mr-2" />
          Nouvelle consultation
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Nouvelle consultation</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motif</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date RDV</label>
                <input
                  type="datetime-local"
                  name="nextAppointment"
                  value={formData.nextAppointment}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pression artérielle (systolique)</label>
                <input
                  type="number"
                  name="systolic"
                  value={formData.systolic}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pression artérielle (diastolique)</label>
                <input
                  type="number"
                  name="diastolic"
                  value={formData.diastolic}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taille (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Créatinine (mg/dL)</label>
                <input
                  type="number"
                  name="creatinineLevel"
                  value={formData.creatinineLevel}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DFG (mL/min)</label>
                <input
                  type="number"
                  name="gfr"
                  value={formData.gfr}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
              <textarea
                name="observations"
                value={formData.observations}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                disabled={loading}
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {consultations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune consultation enregistrée pour ce patient
          </div>
        ) : (
          consultations.map(consultation => (
            <div key={consultation._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <Calendar className="text-indigo-600 mr-2" size={18} />
                  <span className="font-semibold">
                    {formatDate(consultation.date)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Dr. {consultation.doctor.firstName} {consultation.doctor.lastName}
                </div>
              </div>

              <div className="mb-3">
                <h3 className="font-medium text-lg">{consultation.reason}</h3>
                {consultation.observations && (
                  <p className="text-gray-700 mt-1">{consultation.observations}</p>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {consultation.bloodPressure && (
                  <div>
                    <span className="text-gray-500">Pression:</span>{' '}
                    <span className="font-medium">
                      {consultation.bloodPressure.systolic}/{consultation.bloodPressure.diastolic} mmHg
                    </span>
                  </div>
                )}
                {consultation.creatinineLevel && (
                  <div>
                    <span className="text-gray-500">Créatinine:</span>{' '}
                    <span className="font-medium">
                      {consultation.creatinineLevel} mg/dL
                    </span>
                  </div>
                )}
                {consultation.gfr && (
                  <div>
                    <span className="text-gray-500">DFG:</span>{' '}
                    <span className="font-medium">
                      {consultation.gfr} mL/min
                    </span>
                  </div>
                )}
                {consultation.nextAppointment && (
                  <div>
                    <span className="text-gray-500">Prochain RDV:</span>{' '}
                    <span className="font-medium">
                      {formatDate(consultation.nextAppointment)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}