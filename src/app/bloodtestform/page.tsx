'use client';
import { useState } from "react";

export default function BloodTestForm() {
  const [results, setResults] = useState({});

  const parameters = [
    { name: "Globules rouges", unit: "x10¹²/L", normal: "6,54-12,20" },
    { name: "Hématocrite", unit: "%", normal: "30,3-52,3" },
    { name: "Hémoglobine", unit: "g/dL", normal: "9,8-16,2" },
    { name: "VGM", unit: "fL", normal: "35,9-53,1" },
    { name: "TGMH", unit: "pg", normal: "11,8-17,3" },
    { name: "Plaquettes", unit: "x10³/µL", normal: "151-600" },
    { name: "Glucose", unit: "g/L", normal: "0,74-1,59" },
    { name: "Créatinine", unit: "mg/L", normal: "8,0-24,0" },
    { name: "Na+", unit: "mmol/L", normal: "144-160" },
    { name: "K+", unit: "mmol/L", normal: "3,9-5,3" },
  ];

  const handleChange = (e, name) => {
    setResults({ ...results, [name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h2 className="text-xl font-bold mb-4">Formulaire d'Analyse Sanguine</h2>
      <div className="border rounded-lg overflow-hidden shadow-lg">
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
                <td className="p-2 border">{param.name} ({param.unit})</td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={results[param.name] || ""}
                    onChange={(e) => handleChange(e, param.name)}
                    className="w-full p-1 border rounded"
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
          className="w-full p-2 border rounded"
          defaultValue="Examen cytobactériologique en faveur d'une infection urinaire. Résultats à confronter aux données cliniques."
        />
      </div>
    </div>
  );
}
