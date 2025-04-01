// types/patient.ts
export interface Disease {
  name: string;
  stage?: 'débutant' | 'intermédiaire' | 'avancé' | 'chronique' | '';
  diagnosisDate?: string;
}

export interface Address {
  street?: string;
  city?: string;
  country?: string;
}

export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | '';
  height?: number;
  weight?: number;
  diseases?: Disease[];
  address?: Address;
  phone: string;
  email?: string;
  fileNumber: string;
  attendingDoctor: string;
  attendingDoctorName?: string;
  age: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}