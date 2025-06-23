const { Box, LinearProgress } = require("@material-ui/core");

const DefaultSkeleton = () => (
  <Box
    alignItems="center"
    justifyContent="center"
    width="100%"
    height="100%"
  >
    <LinearProgress />
  </Box>
);

export default DefaultSkeleton;
