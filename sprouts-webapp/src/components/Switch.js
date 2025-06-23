import { FormControlLabel, Switch as MuiSwitch } from "@material-ui/core";

const Switch = ({ checked, onChange, label, ...rest }) => (
  <FormControlLabel
    control={(
      <MuiSwitch
        checked={checked}
        onChange={async (_, checked) => {
          onChange(checked);
        }}
        color="primary"
        {...rest}
      />
    )}
    label={label}
  />
);

export default Switch;
