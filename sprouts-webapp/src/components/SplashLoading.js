import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useEffect, useState } from "react";
import { useTranslation } from "i18n";

const SplashLoading = ({ messageWhenTakingLong }) => {
  const { t } = useTranslation();
  const [takingLong, setTakingLong] = useState();

  useEffect(() => {
    const timer = setTimeout(() => {
      setTakingLong(true);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Box
      flexGrow={1}
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <Box width={350}>
        <Typography
          style={{ color: "white" }}
          className="font-bold"
          variant="h5"
          paragraph
        >
          {t("LOADING")}
        </Typography>
        <LinearProgress />
        {takingLong && (
          <Typography variant="caption" color="error">
            {messageWhenTakingLong}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SplashLoading;
