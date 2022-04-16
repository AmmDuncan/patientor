import { Formik, Form, Field } from "formik";
import { Entry, UnionOmit } from "../types";
import {
  SelectField,
  TextField,
  TypeOption,
  RatingOption,
  DiagnosisSelection,
} from "../AddPatientModal/FormField";
import { useStateValue } from "../state";
import { Grid, Button } from "@material-ui/core";

export type EntryFormValues = UnionOmit<Entry, "id">;

interface AddEntryFormProps {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const typeOptions: TypeOption[] = [
  { value: "Hospital", label: "Hospital" },
  { value: "OccupationalHealthcare", label: "Occupational Healthcare" },
  { value: "HealthCheck", label: "HealthCheck" },
];

const healthRatingOptions: RatingOption[] = [
  { value: 0, label: "Healthy" },
  { value: 1, label: "Low Risk" },
  { value: 2, label: "High Risk" },
  { value: 3, label: "Critical Risk" },
];

const AddEntryForm = ({ onSubmit, onCancel }: AddEntryFormProps) => {
  const [{ diagnoses }] = useStateValue();
  const isHospital = (type: Entry["type"]) => type === "Hospital";
  const isHealthCheck = (type: Entry["type"]) => type === "HealthCheck";
  const isOccupationalHealthcare = (type: Entry["type"]) =>
    type === "OccupationalHealthcare";
  return (
    <Formik
      initialValues={{
        type: "Hospital",
        date: new Date().toISOString().split("T")[0],
        specialist: "",
        description: "",
        diagnosisCodes: [],
        discharge: {
          date: new Date().toISOString().split("T")[0],
          criteria: "",
        },
        employerName: "",
        sickLeave: {
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date().toISOString().split("T")[0],
        },
        healthCheckRating: 0,
      }}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, setFieldTouched, values, dirty, isValid }) => (
        <Form className="form ui">
          <SelectField name="type" label="Type" options={typeOptions} />
          <Field name="date" label="Date" component={TextField} />
          <Field name="specialist" label="Specialist" component={TextField} />
          <Field name="description" label="Description" component={TextField} />
          <DiagnosisSelection
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
            diagnoses={Object.values(diagnoses)}
          />
          {isHospital(values.type) ? (
            <>
              <Field
                name="discharge.date"
                label="Discharge date"
                component={TextField}
              />
              <Field
                name="discharge.criteria"
                label="Discharge criteria"
                component={TextField}
              />
            </>
          ) : null}
          {isOccupationalHealthcare(values.type) ? (
            <>
              <Field
                name="employerName"
                label="Employer Name"
                component={TextField}
              />
              <Field
                name="sickLeave.startDate"
                label="Sick Leave Start Date"
                component={TextField}
              />
              <Field
                name="sickLeave.endDate"
                label="Sick Leave End Date"
                component={TextField}
              />
            </>
          ) : null}
          {isHealthCheck(values.type) ? (
            <>
              <SelectField
                name="healthCheckRating"
                label="Health Check Rating"
                options={healthRatingOptions}
              />
            </>
          ) : null}
          <Grid
            style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <Grid item>
              <Button
                color="secondary"
                variant="contained"
                type="button"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                disabled={!dirty || !isValid}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default AddEntryForm;
