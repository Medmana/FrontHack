'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FileSearch, Plus, Edit, Trash2, ChevronLeft, Save } from 'lucide-react';
const accessToken = localStorage.getItem('access_token');
import { useRole } from '../../../../hooks/useRole';
interface Exam {
  _id: string;
  examDate: string | Date;
  // Champs sanguins
  redBloodCells?: number;
  hematocrit?: number;
  hemoglobin?: number;
  mcv?: number;
  mch?: number;
  platelets?: number;
  glucose?: number;
  creatinine?: number;
  // Champs urinaires
  appearance?: string;
  color?: string;
  turbidity?: string;
  pH?: string;
  leukocytes?: number;
  erythrocytes?: number;
  germCount?: number;
  identifiedBacteria?: string;
  conclusion?: string;
  isAbnormal?: boolean;
  requiresFollowUp?: boolean;
}

export default function PatientExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'blood' | 'urin'>('blood');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Exam>>({});
  
  const params = useParams();
  const patientId = params?.id || params?.patientId;

  useEffect(() => {
    if (!patientId) return;

    const loadExams = async () => {
      try {
        setLoading(true);
        const endpoint = `https://backhack-production.up.railway.app/api/exams/${activeTab}/${patientId}`;
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        
        if (!response.ok) throw new Error('Erreur de chargement');
        
        const data = await response.json();
        setExams(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [patientId, activeTab]);

  const handleViewDetails = (exam: Exam) => {
    setSelectedExam(exam);
    setIsEditing(false);
  };

  const handleEdit = (exam: Exam) => {
    setSelectedExam(exam);
    setEditData({ ...exam });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedExam) return;

    try {
      const response = await fetch(`https://backhack-production.up.railway.app/api/exams/${activeTab}/${selectedExam._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) throw new Error('Échec de la mise à jour');

      // Mettre à jour la liste des examens
      const updatedExams = exams.map(exam => 
        exam._id === selectedExam._id ? { ...exam, ...editData } : exam
      );
      setExams(updatedExams);
      setSelectedExam({ ...selectedExam, ...editData });
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (examId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet examen ?')) return;

    try {
      const response = await fetch(`https://backhack-production.up.railway.app/api/exams/${activeTab}/${examId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.ok) {
        setExams(exams.filter(exam => exam._id !== examId));
        if (selectedExam?._id === examId) {
          setSelectedExam(null);
        }
      }
    } catch (error) {
      console.error('Erreur de suppression:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name.endsWith('Date') ? value : Number(value) || value
    }));
  };
  const isauth = useRole('doctor');
  
  if (!isauth) return null;
  return (
    <div className=" max-w-5xl container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Examens et Résultats</h1>
      </div>

      <div className="flex border-b mb-6">
        <button
          className={`flex items-center py-2 px-4 ${
            activeTab === 'blood' ? 'border-b-2 border-blue-500 font-semibold' : ''
          }`}
          onClick={() => {
            setActiveTab('blood');
            setSelectedExam(null);
          }}
        >
          <FileSearch className="w-5 h-5 mr-2 text-orange-500" />
          Examens Sanguins
        </button>
        <button
          className={`flex items-center py-2 px-4 ${
            activeTab === 'urin' ? 'border-b-2 border-blue-500 font-semibold' : ''
          }`}
          onClick={() => {
            setActiveTab('urin');
            setSelectedExam(null);
          }}
        >
          <FileSearch className="w-5 h-5 mr-2 text-orange-500" />
          Examens Urinaires
        </button>
      </div>

      <div className="flex gap-6">
        {/* Liste des examens */}
        <div className="flex-1">
        <div className="mb-4 flex justify-end">
        <Link
          href={`/${activeTab}/${patientId}`}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un examen
        </Link>
      </div>

          {loading ? (
            <div className="text-center py-8">Chargement en cours...</div>
          ) : exams.length === 0 ? (
            <div className="text-center py-8">Aucun examen trouvé</div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {exams.map(exam => (
                    <tr key={exam._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(exam.examDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(exam)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Voir détails"
                        >
                          <FileSearch className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(exam)}
                          className="text-green-500 hover:text-green-700"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(exam._id)}
                          className="text-red-500 hover:text-red-700"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Détails/Modification de l'examen */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow">
          {selectedExam ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {isEditing ? 'Modifier Examen' : 'Détails de l\'Examen'}
                </h2>
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className="flex items-center bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    <Save className="w-4 h-4 mr-1" /> Enregistrer
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(selectedExam)}
                    className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    <Edit className="w-4 h-4 mr-1" /> Modifier
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      name="examDate"
                      value={editData.examDate ? new Date(editData.examDate).toISOString().split('T')[0] : ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {activeTab === 'blood' ? (
  <>
    {/* Examens Sanguins */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Globules rouges (x10¹²/L)</label>
        <input
          type="number"
          step="0.01"
          name="redBloodCells"
          value={editData.redBloodCells || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Hématocrite (%)</label>
        <input
          type="number"
          step="0.1"
          name="hematocrit"
          value={editData.hematocrit || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Hémoglobine (g/dL)</label>
        <input
          type="number"
          step="0.1"
          name="hemoglobin"
          value={editData.hemoglobin || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">VGM (fL)</label>
        <input
          type="number"
          step="0.1"
          name="mcv"
          value={editData.mcv || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">TGMH (pg)</label>
        <input
          type="number"
          step="0.1"
          name="mch"
          value={editData.mch || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Plaquettes (x10³/μL)</label>
        <input
          type="number"
          name="platelets"
          value={editData.platelets || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Glucose (g/L)</label>
        <input
          type="number"
          step="0.01"
          name="glucose"
          value={editData.glucose || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Créatinine (mg/L)</label>
        <input
          type="number"
          step="0.1"
          name="creatinine"
          value={editData.creatinine || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
    </div>
  </>
) : (
  <>
    {/* Examens Urinaires */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Aspect</label>
        <select
          name="appearance"
          value={editData.appearance || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        >
          <option value="Clair">Clair</option>
          <option value="Trouble">Trouble</option>
          <option value="Hémorragique">Hémorragique</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Couleur</label>
        <input
          type="text"
          name="color"
          value={editData.color || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Turbidité</label>
        <select
          name="turbidity"
          value={editData.turbidity || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        >
          <option value="Limide">Limide</option>
          <option value="Légèrement trouble">Légèrement trouble</option>
          <option value="Très trouble">Très trouble</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">pH</label>
        <input
          type="number"
          step="0.1"
          name="pH"
          value={editData.pH || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Leucocytes (/μL)</label>
        <input
          type="number"
          name="leukocytes"
          value={editData.leukocytes || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Érythrocytes (/μL)</label>
        <input
          type="number"
          name="erythrocytes"
          value={editData.erythrocytes || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Germes (/mL)</label>
        <input
          type="number"
          name="germCount"
          value={editData.germCount || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Bactéries identifiées</label>
        <input
          type="text"
          name="identifiedBacteria"
          value={editData.identifiedBacteria || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
        />
      </div>
    </div>
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Conclusion</label>
      <textarea
        name="conclusion"
        rows={3}
        value={editData.conclusion || ''}
        onChange={handleInputChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
      />
    </div>
    <div className="mt-4 flex gap-4">
      <label className="flex items-center">
        <input
          type="checkbox"
          name="isAbnormal"
          checked={!!editData.isAbnormal}
          onChange={(e) => setEditData({...editData, isAbnormal: e.target.checked})}
          className="mr-2"
        />
        Résultats anormaux
      </label>
      <label className="flex items-center">
        <input
          type="checkbox"
          name="requiresFollowUp"
          checked={!!editData.requiresFollowUp}
          onChange={(e) => setEditData({...editData, requiresFollowUp: e.target.checked})}
          className="mr-2"
        />
        Suivi nécessaire
      </label>
    </div>
  </>
)}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p>{new Date(selectedExam.examDate).toLocaleDateString()}</p>
                  </div>

                  {activeTab === 'blood' ? (
  <>
    {/* Détails Examens Sanguins */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-500">Globules rouges</p>
        <p>{selectedExam.redBloodCells} x10¹²/L</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Hématocrite</p>
        <p>{selectedExam.hematocrit} %</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Hémoglobine</p>
        <p>{selectedExam.hemoglobin} g/dL</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">VGM</p>
        <p>{selectedExam.mcv} fL</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">TGMH</p>
        <p>{selectedExam.mch} pg</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Plaquettes</p>
        <p>{selectedExam.platelets} x10³/μL</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Glucose</p>
        <p>{selectedExam.glucose} g/L</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Créatinine</p>
        <p>{selectedExam.creatinine} mg/L</p>
      </div>
    </div>
  </>
) : (
  <>
    {/* Détails Examens Urinaires */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-500">Aspect</p>
        <p>{selectedExam.appearance}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Couleur</p>
        <p>{selectedExam.color}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Turbidité</p>
        <p>{selectedExam.turbidity}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">pH</p>
        <p>{selectedExam.pH}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Leucocytes</p>
        <p>{selectedExam.leukocytes} /μL</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Érythrocytes</p>
        <p>{selectedExam.erythrocytes} /μL</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Germes</p>
        <p>{selectedExam.germCount} /mL</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Bactéries</p>
        <p>{selectedExam.identifiedBacteria || 'Non spécifié'}</p>
      </div>
    </div>
    <div className="mt-4">
      <p className="text-sm text-gray-500">Conclusion</p>
      <p className="whitespace-pre-wrap">{selectedExam.conclusion}</p>
    </div>
    <div className="mt-4 flex gap-4">
      <p className="text-sm font-medium">
        Résultats: <span className={selectedExam.isAbnormal ? 'text-red-600' : 'text-green-600'}>
          {selectedExam.isAbnormal ? 'Anormaux' : 'Normaux'}
        </span>
      </p>
      <p className="text-sm font-medium">
        Suivi: <span className={selectedExam.requiresFollowUp ? 'text-blue-600' : 'text-gray-600'}>
          {selectedExam.requiresFollowUp ? 'Requis' : 'Non requis'}
        </span>
      </p>
    </div>
  </>
)}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileSearch className="mx-auto h-12 w-12" />
              <h3 className="mt-2 text-sm font-medium">Aucun examen sélectionné</h3>
              <p className="mt-1 text-sm">Sélectionnez un examen pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}