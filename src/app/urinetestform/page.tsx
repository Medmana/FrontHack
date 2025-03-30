'use client';
import { useState } from "react";

export default function UrineTestForm() {
  const [results, setResults] = useState({
    aspect: "Trouble",
    pH: "Acide",
    leucocytes: "123",
    hemabies: "44",
    cellulesEpitheliales: "1",
    cellulesVesicoles: "0",
    cellulesEtoiles: "9",
    levures: "Présence",
    nonLevures: "26",
    germesUrinaires: "11.573",
    ufcMl: "10^1",
    culture: "Pseudomonas aeruginosa"
  });

  const handleChange = (e, field) => {
    setResults({ ...results, [field]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h2 className="text-xl font-bold mb-4">EXAMEN CYTOBACTÉRIOLOGIQUE DES URINES</h2>
      
      <div className="mb-4">
        <label className="block font-semibold mb-2">Renseignements cliniques</label>
        <input 
          type="text" 
          className="w-full p-2 border rounded"
          placeholder="Bilian"
        />
      </div>

      <div className="border rounded-lg overflow-hidden shadow-lg mb-6">
        <h3 className="bg-gray-200 p-2 font-semibold">EXAMEN MACROSCOPIQUE</h3>
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border">
              <td className="p-2 border w-1/3">Aspect</td>
              <td className="p-2 border">
                <select 
                  value={results.aspect}
                  onChange={(e) => handleChange(e, "aspect")}
                  className="w-full p-1 border rounded"
                >
                  <option value="Trouble">Trouble</option>
                  <option value="Clair">Clair</option>
                  <option value="Sanguinolent">Sanguinolent</option>
                </select>
              </td>
            </tr>
            <tr className="border">
              <td className="p-2 border">PH</td>
              <td className="p-2 border">
                <select 
                  value={results.pH}
                  onChange={(e) => handleChange(e, "pH")}
                  className="w-full p-1 border rounded"
                >
                  <option value="Acide">Acide</option>
                  <option value="Neutre">Neutre</option>
                  <option value="Basique">Basique</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-lg mb-6">
        <h3 className="bg-gray-200 p-2 font-semibold">EXAMEN MICROSCOPIQUE</h3>
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border">
              <td className="p-2 border w-1/3">Leucocytes</td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={results.leucocytes}
                  onChange={(e) => handleChange(e, "leucocytes")}
                  className="w-full p-1 border rounded"
                />
              </td>
            </tr>
            <tr className="border">
              <td className="p-2 border">Hémabies</td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={results.hemabies}
                  onChange={(e) => handleChange(e, "hemabies")}
                  className="w-full p-1 border rounded"
                />
              </td>
            </tr>
            <tr className="border">
              <td className="p-2 border">Cellules épithéliales</td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={results.cellulesEpitheliales}
                  onChange={(e) => handleChange(e, "cellulesEpitheliales")}
                  className="w-full p-1 border rounded"
                />
              </td>
            </tr>
            <tr className="border">
              <td className="p-2 border">Cellules vésicoles</td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={results.cellulesVesicoles}
                  onChange={(e) => handleChange(e, "cellulesVesicoles")}
                  className="w-full p-1 border rounded"
                />
              </td>
            </tr>
            <tr className="border">
              <td className="p-2 border">Cellules étoiles</td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={results.cellulesEtoiles}
                  onChange={(e) => handleChange(e, "cellulesEtoiles")}
                  className="w-full p-1 border rounded"
                />
              </td>
            </tr>
            <tr className="border">
              <td className="p-2 border">Crèseaux</td>
              <td className="p-2 border">Absence</td>
            </tr>
            <tr className="border">
              <td className="p-2 border">Cylindres pathologiques</td>
              <td className="p-2 border">Absence</td>
            </tr>
            <tr className="border">
              <td className="p-2 border">Leuves</td>
              <td className="p-2 border">
                <select 
                  value={results.levures}
                  onChange={(e) => handleChange(e, "levures")}
                  className="w-full p-1 border rounded"
                >
                  <option value="Présence">Présence</option>
                  <option value="Absence">Absence</option>
                </select>
              </td>
            </tr>
            <tr className="border">
              <td className="p-2 border">Non Leuves</td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={results.nonLevures}
                  onChange={(e) => handleChange(e, "nonLevures")}
                  className="w-full p-1 border rounded"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-lg mb-6">
        <h3 className="bg-gray-200 p-2 font-semibold">DÉNOMBREMENT</h3>
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border">
              <td className="p-2 border w-1/3">Dénombrement des germes urinaires (IOU)</td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={results.germesUrinaires}
                  onChange={(e) => handleChange(e, "germesUrinaires")}
                  className="w-full p-1 border rounded"
                />
              </td>
            </tr>
            <tr className="border">
              <td className="p-2 border">UFC/ml</td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={results.ufcMl}
                  onChange={(e) => handleChange(e, "ufcMl")}
                  className="w-full p-1 border rounded"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-lg mb-6">
        <h3 className="bg-gray-200 p-2 font-semibold">IDENTIFICATION</h3>
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border">
              <td className="p-2 border w-1/3">Culture</td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={results.culture}
                  onChange={(e) => handleChange(e, "culture")}
                  className="w-full p-1 border rounded"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Référence Laboratoire</label>
        <input 
          type="text" 
          className="w-full p-2 border rounded"
          placeholder="836.REG / 403.Phoenix"
        />
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