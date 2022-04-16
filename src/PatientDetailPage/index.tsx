import axios from "axios";
import React, { useEffect, useState } from "react";
import { Diagnosis, Patient } from "../types";
import { useStateValue } from "../state";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { parsePatient } from "../typeParsers";
import Typography from "@material-ui/core/Typography";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { updatePatientDetails, setDiagnoses } from "../state";
import EntryDetails from "../components/EntryDetails";
import { Button } from "@material-ui/core";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import "./styles.css";

const isString = (str: unknown): str is string => {
  return typeof str === "string" || str instanceof String;
};

const parseId = (val: unknown): string => {
  if (!val || !isString(val)) throw new Error("Invalid patient id");
  return val;
};

const PatientDetailPage = () => {
  try {
    const id = parseId(useParams<{ id: string }>().id);
    const [{ patientDetails, diagnoses }, dispatch] = useStateValue();
    const [patient, setPatient] = useState<Patient>(patientDetails[id]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [error, setError] = React.useState<string>("");

    const openModal = () => setModalOpen(true);

    const submitValues = (values: EntryFormValues) => {
      const type = values.type;
      let selectedValues = {
        type,
        date: values.date.trim(),
        specialist: values.specialist.trim(),
        description: values.description.trim(),
        diagnosisCodes: values.diagnosisCodes,
      };
      let additionalValues = {};

      switch (type) {
        case "Hospital":
          additionalValues = {
            discharge: values.discharge,
          };
          break;
        case "OccupationalHealthcare":
          additionalValues = {
            employerName: values.employerName,
            sickLeave: values.sickLeave,
          };
          break;
        case "HealthCheck":
          additionalValues = {
            healthCheckRating: values.healthCheckRating,
          };
          break;
      }

      selectedValues = { ...selectedValues, ...additionalValues };
      const cleanedValues = Object.entries(selectedValues).reduce(
        (acc: { [key: string]: unknown }, [key, value]) => {
          if (value || (isString(value) && parseInt(value) === 0)) {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );
      axios
        .post<Patient>(`${apiBaseUrl}/patients/${id}/entries`, cleanedValues)
        .then((response) => {
          dispatch(updatePatientDetails(response.data));
          setModalOpen(false);
          setError("");
        })
        .catch((e) => {
          if (axios.isAxiosError(e) && e.response) {
            setError(String(e.response.data.error));
          } else {
            console.error("Unknown error", e);
            setError("Unknown error");
          }
        });
    };

    useEffect(() => {
      setPatient(patientDetails[id]);
    }, [patientDetails]);

    useEffect(() => {
      if (!patient) {
        axios
          .get<Patient[]>(`${apiBaseUrl}/patients/${id}`)
          .then((response) => {
            if (!response.data) console.log("something unexpected happened");
            const resPatient = parsePatient(response.data[0]);
            setPatient(resPatient);
            dispatch(updatePatientDetails(resPatient));
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }, [patientDetails]);

    useEffect(() => {
      if (!Object.keys(diagnoses).length) {
        axios
          .get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`)
          .then((response) => {
            dispatch(setDiagnoses(response.data));
          })
          .catch((e) => console.log(e));
      }
    }, []);

    if (!patient) return <p>loading...</p>;

    return (
      <div style={{ marginTop: "1em" }}>
        <Typography variant="h4">
          {patient.name}
          {patient.gender === "male" ? <MaleIcon fontSize="large" /> : null}
          {patient.gender === "female" ? <FemaleIcon fontSize="large" /> : null}
          {patient.gender === "other" ? <CircleOutlinedIcon /> : null}
        </Typography>
        <br />
        <p>ssn: {patient.ssn}</p>
        <p>occupation: {patient.occupation}</p>
        <br />
        <br />
        <Typography variant="h5">entries</Typography>
        {patient.entries?.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} />
        ))}
        <br />
        <br />
        <Button variant="contained" onClick={openModal}>
          Add Entry
        </Button>
        <AddEntryModal
          modalOpen={modalOpen}
          onSubmit={submitValues}
          error={error}
          onClose={() => setModalOpen(false)}
        />
      </div>
    );
  } catch {
    return <p>Patient record not found</p>;
  }
};

export default PatientDetailPage;
