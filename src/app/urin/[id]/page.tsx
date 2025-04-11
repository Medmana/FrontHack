'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function UrinExamForm() {
  const router = useRouter();
  const params = useParams();
  const patientId = params?.id || params?.patientId;
  const [formData, setFormData] = useState({
    labReference: '',
    clinicalInfo: '',
    appearance: '',
    color: '',
    turbidity: '',
    pH: '',
    leukocytes: '',
    erythrocytes: '',
    epithelialCells: '',
    bladderCells: '',
    renalCells: '',
    crystals: '',
    pathologicalCylinders: '',
    yeastsPresent: false,
    yeastsCount: '',
    germCount: '',
    identifiedBacteria: '',
    conclusion: '',
    isAbnormal: false,
    requiresFollowUp: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem('access_token');
      


      const examData = {
        patientId,
        ...formData,
        leukocytes: Number(formData.leukocytes),
        erythrocytes: Number(formData.erythrocytes),
        epithelialCells: Number(formData.epithelialCells),
        bladderCells: Number(formData.bladderCells),
        renalCells: Number(formData.renalCells),
        yeasts: {
          present: formData.yeastsPresent,
          count: Number(formData.yeastsCount) || 0
        },
        germCount: Number(formData.germCount) || 0
      };

      const response = await fetch('https://backhack-production.up.railway.app/api/exams/urin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(examData)
      });

      if (!response.ok) throw new Error(await response.text());

      router.push(`/afficher_dossier/${patientId}/exam`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-6">Nouvel Examen Urinaire</h1>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Informations Générales */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Informations Générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Référence Laboratoire</label>
              <input
                type="text"
                name="labReference"
                value={formData.labReference}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Informations Cliniques</label>
              <input
                type="text"
                name="clinicalInfo"
                value={formData.clinicalInfo}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Section Macroscopique */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Examen Macroscopique</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Aspect</label>
              <select
                name="appearance"
                value={formData.appearance}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionner</option>
                <option value="Clair">Clair</option>
                <option value="Trouble">Trouble</option>
                <option value="Hémorragique">Hémorragique</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Couleur</label>
              <select
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionner</option>
                <option value="Jaune clair">Jaune clair</option>
                <option value="Jaune foncé">Jaune foncé</option>
                <option value="Rouge">Rouge</option>
                <option value="Blanc laiteux">Blanc laiteux</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Turbidité</label>
              <select
                name="turbidity"
                value={formData.turbidity}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionner</option>
                <option value="Limide">Limide</option>
                <option value="Légèrement trouble">Légèrement trouble</option>
                <option value="Très trouble">Très trouble</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">pH</label>
              <input
                type="number"
                step="0.1"
                name="pH"
                value={formData.pH}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Section Microscopique */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Examen Microscopique</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">Leucocytes (/μL)</label>
              <input
                type="number"
                name="leukocytes"
                value={formData.leukocytes}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Érythrocytes (/μL)</label>
              <input
                type="number"
                name="erythrocytes"
                value={formData.erythrocytes}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Cellules épithéliales (/μL)</label>
              <input
                type="number"
                name="epithelialCells"
                value={formData.epithelialCells}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Cristaux</label>
              <select
                name="crystals"
                value={formData.crystals}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionner</option>
                <option value="Aucun">Aucun</option>
                <option value="Oxalate de calcium">Oxalate de calcium</option>
                <option value="Urates">Urates</option>
                <option value="Phosphates">Phosphates</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Cylindres pathologiques</label>
              <select
                name="pathologicalCylinders"
                value={formData.pathologicalCylinders}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionner</option>
                <option value="Aucun">Aucun</option>
                <option value="Granuleux">Granuleux</option>
                <option value="Hyalins">Hyalins</option>
                <option value="Leucocytaires">Leucocytaires</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="yeastsPresent"
                  checked={formData.yeastsPresent}
                  onChange={handleChange}
                  className="mr-2"
                />
                Levures présentes
              </label>
              {formData.yeastsPresent && (
                <div>
                  <label className="block mb-2">Nombre de levures (/μL)</label>
                  <input
                    type="number"
                    name="yeastsCount"
                    value={formData.yeastsCount}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Bactériologie */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Bactériologie</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Germes (/mL)</label>
              <input
                type="number"
                name="germCount"
                value={formData.germCount}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Bactéries identifiées</label>
              <input
                type="text"
                name="identifiedBacteria"
                value={formData.identifiedBacteria}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Section Conclusion */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Conclusion</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Interprétation</label>
              <textarea
                name="conclusion"
                value={formData.conclusion}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isAbnormal"
                  checked={formData.isAbnormal}
                  onChange={handleChange}
                  className="mr-2"
                />
                Résultats anormaux
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="requiresFollowUp"
                  checked={formData.requiresFollowUp}
                  onChange={handleChange}
                  className="mr-2"
                />
                Suivi nécessaire
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push(`/afficher_dossier/${patientId}`)}
            className="px-4 py-2 border rounded"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Fonction helper pour extraire le doctorId du token
function getDoctorIdFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.doctorId || null;
  } catch {
    return null;
  }
}