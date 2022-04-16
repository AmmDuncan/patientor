import { State } from "./state";
import { Patient, Diagnosis } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "UPDATE_PATIENT_DETAILS_LIST";
      payload: Patient;
    }
  | {
      type: "SET_DIAGNOSES";
      payload: Diagnosis[];
    };

export const reducer = (state: State, action: Action): State => {
  const stateCopy = JSON.parse(JSON.stringify(state)) as State;

  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case "UPDATE_PATIENT_DETAILS_LIST":
      const newPatientDetails = action.payload;
      const id = newPatientDetails.id;
      stateCopy.patientDetails[id] = newPatientDetails;
      return stateCopy;
    case "SET_DIAGNOSES":
      action.payload.forEach((diagnosis) => {
        stateCopy.diagnoses[diagnosis.code] = diagnosis;
      });
      return stateCopy;
    default:
      return state;
  }
};

/*
 * ACTION CREATORS
 */
export const setPatientList = (payload: Patient[]): Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload,
  };
};

export const addPatient = (payload: Patient): Action => {
  return {
    type: "ADD_PATIENT",
    payload,
  };
};

export const updatePatientDetails = (payload: Patient): Action => {
  return {
    type: "UPDATE_PATIENT_DETAILS_LIST",
    payload,
  };
};

export const setDiagnoses = (payload: Diagnosis[]): Action => {
  return {
    type: "SET_DIAGNOSES",
    payload,
  };
};
