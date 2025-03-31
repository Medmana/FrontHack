'use client';
import { PlusCircle, AlertCircle, CheckCircle } from "lucide-react";

const antecedents = [
  { date: "8 JUL 14", label: "Asthme (81 ans)", details: "Compte rendu de l'asthme", type: "check" },
  { date: "5 MAI 14", label: "Souffle au coeur (81 ans)", type: "check" },
  { date: "10 MAR 14", label: "Hyperthyroïdie (80 ans)", type: "check" },
  { date: "3 MAR 14", label: "HTA gravidique (80 ans)", type: "check" },
  { date: "2014", label: "Évanouissements (80 ans)", type: "alert" },
  { date: "7 NOV 13", label: "Allergie au kiwi (80 ans)", type: "alert" },
  { date: "16 SEP 13", label: "Thyroïdite d'Hashimoto (80 ans)", details: "Découverte fortuite", type: "check" },
  { date: "16 SEP 13", label: "Diabète (80 ans)", type: "check" },
  { date: "2008", label: "Hypertension Artérielle (74 ans)", details: "HTA grave", type: "check" },
  { label: "Dyslipidémie", type: "check" },
  { label: "Artérite Membres Inférieurs", type: "check" },
  { date: "15 JUN 04", label: "Pontage Aorto-Fémoral (71 ans)", details: "DOC 3222 PONTAGE AORTO", type: "check" },
];

export default function AntecedentsList() {
  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex justify-between items-center bg-teal-700 text-white p-4">
        <h2 className="text-lg font-semibold">Antécédents</h2>
        <button className="p-2 hover:bg-teal-600 rounded-full">
          <PlusCircle size={24} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-red-600 font-semibold border-b pb-2">ANTÉCÉDENTS PERSONNELS</h3>
        <ul className="mt-2 space-y-2">
          {antecedents.map((item, index) => (
            <li key={index} className="flex items-center space-x-2 border-b py-2">
              {item.type === "alert" && <AlertCircle className="text-red-500" size={20} />}
              {item.type === "check" && <CheckCircle className="text-green-500" size={20} />}
              <span className="text-gray-700 font-medium">{item.date && `${item.date} ✓`}</span>
              <span className="text-gray-900">{item.label}</span>
              {item.details && <span className="text-gray-500 text-sm">({item.details})</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
