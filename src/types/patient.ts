export interface Patient {
  id: number;
  name: string;
  age: number;
  diseaseStage: string;
  lastVisit: string;
  doctor: string;
  treatment?: string;
}