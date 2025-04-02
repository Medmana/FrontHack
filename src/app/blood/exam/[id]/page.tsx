'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileSearch, Edit, Trash2, ChevronLeft } from 'lucide-react';

interface UrinExam {
  _id: string;
  patientId: string;
  doctorId: string;
  examDate: string;
  labReference: string;
  clinicalInfo: string;
  appearance: string;
  color: string;
  turbidity: string;
  pH: string;
  leukocytes: number;
  erythrocytes: number;
  epithelialCells: number;
  bladderCells: number;
  renalCells: number;
  crystals: string;
  pathologicalCylinders: string;
  yeasts: {
    present: boolean;
    count: number;
  };
  germCount: number;
  identifiedBacteria: string;
  conclusion: string;
  isAbnormal: boolean;
  requiresFollowUp: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UrinExamDetails() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [exam, setExam] = useState<UrinExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchExam = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/exams/urin/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Examen non trouvé');
        }

        const data = await response.json();
        setExam(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet examen ?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/exams/urin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Échec de la suppression');
      }

      router.push(`/afficher_dossier/${exam?.patientId}/examens`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-5">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="max-w-4xl mx-auto p-5">
        <p>Examen non trouvé</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="mr-1" /> Retour
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/exams/urin/edit/${id}`)}
            className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            <Edit size={16} className="mr-1" /> Modifier
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <Trash2 size={16} className="mr-1" /> Supprimer
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-2">Examen Urinaire</h1>
      <p className="text-gray-600 mb-6">
        {new Date(exam.examDate).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Informations Générales</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Référence Labo</p>
            <p>{exam.labReference || 'Non spécifié'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Informations Cliniques</p>
            <p>{exam.clinicalInfo || 'Non spécifié'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Examen Macroscopique</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Aspect</p>
            <p>{exam.appearance || 'Non spécifié'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Couleur</p>
            <p>{exam.color || 'Non spécifié'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Turbidité</p>
            <p>{exam.turbidity || 'Non spécifié'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">pH</p>
            <p>{exam.pH || 'Non spécifié'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Examen Microscopique</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Leucocytes (/μL)</p>
            <p>{exam.leukocytes}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Érythrocytes (/μL)</p>
            <p>{exam.erythrocytes}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cellules épithéliales (/μL)</p>
            <p>{exam.epithelialCells}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cellules vésicales (/μL)</p>
            <p>{exam.bladderCells}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cellules rénales (/μL)</p>
            <p>{exam.renalCells}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cristaux</p>
            <p>{exam.crystals || 'Aucun'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cylindres pathologiques</p>
            <p>{exam.pathologicalCylinders || 'Aucun'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Levures</p>
            <p>{exam.yeasts.present ? `Présentes (${exam.yeasts.count}/μL)` : 'Absentes'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Bactériologie</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Germes (/mL)</p>
            <p>{exam.germCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Bactéries identifiées</p>
            <p>{exam.identifiedBacteria || 'Non spécifié'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Conclusion</h2>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Interprétation</p>
            <p className="whitespace-pre-wrap">{exam.conclusion || 'Non spécifié'}</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-sm text-gray-500">Résultats</p>
              <p className={exam.isAbnormal ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                {exam.isAbnormal ? 'Anormaux' : 'Normaux'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Suivi</p>
              <p className={exam.requiresFollowUp ? 'text-blue-600 font-medium' : 'text-gray-600'}>
                {exam.requiresFollowUp ? 'Nécessaire' : 'Non requis'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-6">
        <p>Créé le : {new Date(exam.createdAt).toLocaleDateString('fr-FR')}</p>
        {exam.updatedAt !== exam.createdAt && (
          <p>Dernière modification : {new Date(exam.updatedAt).toLocaleDateString('fr-FR')}</p>
        )}
      </div>
    </div>
  );
}