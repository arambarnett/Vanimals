import { Box, Typography, Grid, Slider } from "@material-ui/core";
import { useTranslation } from "i18n";

const VanimalSkills = ({ skills }) => {
  const { t } = useTranslation();

  return (
    <Box width={1}>
      <Typography className="font-bold" variant="h4" paragraph>
        {t("SKILLS")}
      </Typography>
      <Grid container spacing={4} alignItems="flex-end">
        {skills.map((skill) => (
          <Grid key={skill.title} item xs={6}>
            <Typography variant="subtitle1">{skill.title}</Typography>
            <Slider
              defaultValue={skill.value}
              aria-labelledby="discrete-slider-always"
              valueLabelDisplay="auto"
              min={1}
              max={100}
              step={1}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VanimalSkills;
