import {
  Box,
  Button,
  Typography,
} from "@material-ui/core";
import { useRouter } from "next/router";
import Egg from "assets/eggs/Egg2.png";
import routes from "routes";

const SuccessBox = () => {
  const router = useRouter();
  return (
    <Box textAlign="center">
      <Box>
        <Typography variant="h4" className="font-bold">Congratulations</Typography>
        <Typography variant="subtitle1" className="font-bold">
          You already have your egg
        </Typography>
      </Box>
      <img alt="Asset not found" src={Egg.src} width={250} height={200} />
      <Box display="flex" flexDirection="column" gridGap={8} mt={2}>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={() => router.push(routes.COLLECTION.MY_EGGS)}
        >
          Go to my eggs
        </Button>
      </Box>
    </Box>
  );
};

export default SuccessBox;
