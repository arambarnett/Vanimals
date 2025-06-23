import { Box } from "@material-ui/core";
import BaseScreen from "components/BaseScreen";
import withMainLayout from "hocs/withMainLayout";
import CardEgg from "components/CardEgg";
import FillBackground from "components/FillBackground";

const Store = () => (
  <>
    <BaseScreen title="Store" subtitle="Egg dispenser">
      <FillBackground />
      <Box mt={5} display="flex" justifyContent="center">
        <CardEgg />
      </Box>
      <Box height={200} />
    </BaseScreen>
  </>
);

export default withMainLayout(Store);
