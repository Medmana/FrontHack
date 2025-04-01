'use client';
import { PlusCircle, AlertCircle, CheckCircle, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AntecedentsList() {
  const params = useParams();
  const patientId = params?.id || params?.patientId;
  
  const [antecedents, setAntecedents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentAntecedent, setCurrentAntecedent] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    type: 'personnel',
    severity: 'modéré',
    diagnosisDate: ''
  });

  useEffect(() => {
    fetchAntecedents();
  }, [patientId]);

  const fetchAntecedents = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/antecedents/patients/${patientId}/antecedents`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur lors de la récupération');
      
      const { data } = await response.json();
      setAntecedents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Fonction dédiée pour la création (POST)
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/antecedents/patients/${patientId}/antecedents`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) throw new Error('Échec de la création');
      
      fetchAntecedents();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  // Fonction dédiée pour la modification (PUT)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/antecedents/${currentAntecedent._id}`, 
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) throw new Error('Échec de la modification');
      
      fetchAntecedents();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setCurrentAntecedent(null);
    setFormData({
      description: '',
      type: 'personnel',
      severity: 'modéré',
      diagnosisDate: ''
    });
  };

  const handleEdit = (antecedent) => {
    setCurrentAntecedent(antecedent);
    setShowForm(true);
    setFormData({
      description: antecedent.description,
      type: antecedent.type,
      severity: antecedent.severity,
      diagnosisDate: antecedent.diagnosisDate?.split('T')[0] || ''
    });
  };

  const handleNewAntecedent = () => {
    setCurrentAntecedent(null);
    setShowForm(true);
    setFormData({
      description: '',
      type: 'personnel',
      severity: 'modéré',
      diagnosisDate: ''
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet antécédent ?')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/antecedents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) throw new Error('Échec de la suppression');
      
      fetchAntecedents();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Erreur: {error}</div>;

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex justify-between items-center bg-teal-700 text-white p-4">
        <h2 className="text-lg font-semibold">Antécédents</h2>
        <button 
          onClick={handleNewAntecedent}
          className="p-2 hover:bg-teal-600 rounded-full"
        >
          <PlusCircle size={24} />
        </button>
      </div>

      {showForm && (
        <div className="p-4 border-b">
          <form onSubmit={currentAntecedent ? handleUpdate : handleCreate}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400 shadow-sm"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400 shadow-sm"
                  >
                    <option value="familial">Familial</option>
                    <option value="personnel">Personnel</option>
                    <option value="chirurgical">Chirurgical</option>
                    <option value="allergie">Allergie</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sévérité</label>
                  <select
                    name="severity"
                    value={formData.severity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400 shadow-sm"
                  >
                    <option value="léger">Léger</option>
                    <option value="modéré">Modéré</option>
                    <option value="sévère">Sévère</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de diagnostic</label>
                <input
                  type="date"
                  name="diagnosisDate"
                  value={formData.diagnosisDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400 shadow-sm"
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
                className="px-4 py-2 text-sm text-white bg-teal-600 rounded-md hover:bg-teal-700"
              >
                {currentAntecedent ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-4">
        <h3 className="text-red-600 font-semibold border-b pb-2">ANTÉCÉDENTS PERSONNELS</h3>
        <ul className="mt-2 space-y-2">
          {antecedents.map((item) => (
            <li key={item._id} className="group flex items-center justify-between border-b py-2">
              <div className="flex items-center space-x-2">
                {item.severity === 'sévère' && <AlertCircle className="text-red-500" size={20} />}
                {item.severity !== 'sévère' && <CheckCircle className="text-green-500" size={20} />}
                <span className="text-gray-700 font-medium">
                  {item.diagnosisDate && `${new Date(item.diagnosisDate).toLocaleDateString('fr-FR')} ✓`}
                </span>
                <span className="text-gray-900">{item.description}</span>
                {item.type && <span className="text-gray-500 text-sm">({item.type})</span>}
              </div>
              
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(item)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}