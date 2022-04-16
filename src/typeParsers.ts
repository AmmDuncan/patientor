import { Patient } from "./types";

const isString = (str: unknown): str is string => {
  return typeof str === "string" || str instanceof String;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parsePatient = (val: any): Patient => {
  if (typeof val !== "object") throw new TypeError("Invalid patient object");
  const expected: string[] = [
    "id",
    "name",
    "occupation",
    "gender",
    "ssn",
    "dateOfBirth",
    "entries",
  ];
  const keys = Object.keys(val as object);
  const values = Object.values(val as object);
  keys.forEach((key) => {
    if (!expected.includes(key))
      throw Error(`Invalid key on Patient: "${key}"`);
  });

  values.forEach((value, i) => {
    const notValid = !isString(value) && !Array.isArray(value);
    if (notValid) {
      throw Error(`Missing or invalid value: ${keys[i]}`);
    }
  });

  return val as Patient;
};
