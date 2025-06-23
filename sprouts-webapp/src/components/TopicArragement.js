import { Box, Typography } from "@material-ui/core";

const TopicArragement = ({ topics }) => (
  <Box display="flex" alignItems="center">
    {topics.map((topic, index) => (
      <Typography key={topic.id} variant="caption" color="textSecondary">
        {index !== 0 && " | "}
        {topic.topicId}
      </Typography>
    ))}
  </Box>
);

export default TopicArragement;
