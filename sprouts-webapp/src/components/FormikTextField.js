import { TextField } from "@material-ui/core";
import { capitalize } from "lodash";

const FormikTextField = ({ formik, name, label, ...rest }) => (
  <TextField
    id={name}
    name={name}
    value={formik.values[name]}
    onChange={formik.handleChange}
    error={formik.touched[name] && !!formik.errors[name]}
    helperText={formik.touched[name] && formik.errors[name]}
    label={label ?? capitalize(name)}
    {...rest}
  />
);

export default FormikTextField;
