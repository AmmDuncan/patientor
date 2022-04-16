import React from "react";
import { Entry } from "../types";
import { useStateValue } from "../state";

interface EntryProps {
  entry: Entry;
}

const EntryDetails = ({ entry }: EntryProps) => {
  const [{ diagnoses }] = useStateValue();
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const diagnosisCodes = (
    <ul>
      {entry.diagnosisCodes?.map((code) => (
        <li key={code}>
          {code} <em>{diagnoses?.[code]?.name}</em>
        </li>
      ))}
    </ul>
  );

  switch (entry.type) {
    case "Hospital":
      return (
        <div className="entry">
          <h3>🏥{entry.date}</h3>
          <p>{entry.description}</p>
          <p>{entry.discharge.criteria}</p>
          {diagnosisCodes}
        </div>
      );
    case "OccupationalHealthcare":
      return (
        <div className="entry">
          <h3>💼{entry.date}</h3>
          <p>{entry.description}</p>
          <p>{entry.employerName}</p>
          {diagnosisCodes}
        </div>
      );
    case "HealthCheck":
      return (
        <div className="entry">
          <h3>🤒{entry.date}</h3>
          <p>{entry.description}</p>
          <div className="health-rating">
            <span>{entry.healthCheckRating === 0 ? "Healthy 💚" : null}</span>
            <span>{entry.healthCheckRating === 1 ? "Low Risk 💛" : null}</span>
            <span>{entry.healthCheckRating === 2 ? "High Risk ❤️" : null}</span>
            <span>{entry.healthCheckRating === 3 ? "Critical 🖤" : null}</span>
          </div>
          {diagnosisCodes}
        </div>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
