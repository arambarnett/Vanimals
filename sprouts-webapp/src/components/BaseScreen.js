import { Box, Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
  },
}));

const BaseScreen = ({ children, title, subtitle, ...rest }) => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container} {...rest}>
      {(title || subtitle) && (
        <Box mb={2}>
          <Typography variant="h5" className="font-extrabold">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="h6" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      {children}
    </Container>
  );
};

export default BaseScreen;
