export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

interface BaseEntry {
  id: string;
  date: string;
  type: string;
  specialist: string;
  description: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
}

enum HealthRating {
  Healthy = 0,
  LowRisk = 1,
  HighRisk = 2,
  CriticalRist = 3,
}

interface HealthCheck extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthRating;
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheck;

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries?: Entry[];
}

export type PatientPublic = Omit<Patient, "ssn" | "entries">;

export type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;
