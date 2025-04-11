'use client';
import { useState } from "react";
import { useParams } from "next/navigation";
import { href } from "react-router-dom";


export default function BloodTestForm() {
  const [results, setResults] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const params = useParams();
  const patientId = params?.id || params?.patientId;
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  const parameters = [
    { name: "redBloodCells", label: "Globules rouges", unit: "x10¹²/L", normal: "6,54-12,20" },
    { name: "hematocrit", label: "Hématocrite", unit: "%", normal: "30,3-52,3" },
    { name: "hemoglobin", label: "Hémoglobine", unit: "g/dL", normal: "9,8-16,2" },
    { name: "mcv", label: "VGM", unit: "fL", normal: "35,9-53,1" },
    { name: "mch", label: "TGMH", unit: "pg", normal: "11,8-17,3" },
    { name: "platelets", label: "Plaquettes", unit: "x10³/µL", normal: "151-600" },
    { name: "glucose", label: "Glucose", unit: "g/L", normal: "0,74-1,59" },
    { name: "creatinine", label: "Créatinine", unit: "mg/L", normal: "8,0-24,0" },
    { name: "sodium", label: "Na+", unit: "mmol/L", normal: "144-160" },
    { name: "potassium", label: "K+", unit: "mmol/L", normal: "3,9-5,3" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setResults({ ...results, [name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Formatage des données pour le backend
      const examData = {
        patientId,
        ...Object.fromEntries(
          Object.entries(results).map(([key, value]) => [key, parseFloat(value)])
      )};
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

      const response = await fetch('https://backhack-production.up.railway.app/api/exams/blood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(examData)
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setSuccess(true);
      setResults({}); // Réinitialiser le formulaire
      window.location.href = `/afficher_dossier/${patientId}/exam`; // Rediriger vers la page des examens sanguins
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h2 className="text-xl font-bold mb-4">Formulaire d'Analyse Sanguine</h2>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">Examen enregistré avec succès!</div>}

      <form onSubmit={handleSubmit}>
        <div className="border rounded-lg overflow-hidden shadow-lg mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-2 border">Paramètre</th>
                <th className="p-2 border">Résultat</th>
                <th className="p-2 border">Valeurs usuelles</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((param, index) => (
                <tr key={index} className="border">
                  <td className="p-2 border">{param.label} ({param.unit})</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      step="0.01"
                      value={results[param.name] || ""}
                      onChange={(e) => handleChange(e, param.name)}
                      className="w-full p-1 border rounded"
                      required
                    />
                  </td>
                  <td className="p-2 border">{param.normal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Conclusion</label>
          <textarea
            name="interpretation"
            value={results.interpretation || ""}
            onChange={(e) => setResults({...results, interpretation: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Examen cytobactériologique en faveur d'une infection urinaire. Résultats à confronter aux données cliniques."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Envoi en cours...' : 'Enregistrer les résultats'}
        </button>
      </form>
    </div>
  );
}