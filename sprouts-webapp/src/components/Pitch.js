import { Box, Collapse, Divider, IconButton, makeStyles, MenuItem, Typography } from "@material-ui/core";
import { useMemo } from "react";
import { getVideoIdByUrl } from "utils";
import { Skeleton } from "@material-ui/lab";
import { MoreVert } from "@material-ui/icons";
import { useSession } from "store/Session";
import { useRouter } from "next/router";
import routes from "routes";
import HorizontalArragement from "./HorizontalArragement";
import TopicArragement from "./TopicArragement";
import Thumbnail from "./Thumbnail";
import YouTube from "./YouTube";
import Popoverize from "./Popoverize";

const useStyles = makeStyles({
  pitchtext: {
    wordBreak: "break-word",
    whiteSpace: "pre-line",
  },
});

const Pitch = ({
  project = { topics: [] },
  videoUrl,
  text,
  target,
  avoid,
  id,
}) => {
  const videoId = useMemo(() => getVideoIdByUrl(videoUrl || ""), [videoUrl]);
  const { data: session } = useSession();
  const router = useRouter();
  const classes = useStyles();

  const isOwner = session?.user.id === project.userId;

  return (
    <Box>
      <HorizontalArragement>
        <Thumbnail size={100} src={project.thumbnail} />
        <Box flexGrow={1}>
          <Typography variant="h6">
            {project.name}
          </Typography>
          <Typography color="textSecondary">
            {project.tagline}
          </Typography>
          <TopicArragement topics={project.topics} />
        </Box>
        <Popoverize
          options={(
            <Box>
              {isOwner && (
                <MenuItem onClick={() => router.push(routes.PITCH_EDIT(id))}>
                  Edit
                </MenuItem>
              )}
              <MenuItem>
                Report
              </MenuItem>
            </Box>
          )}
        >
          <IconButton>
            <MoreVert />
          </IconButton>
        </Popoverize>
      </HorizontalArragement>
      <Divider variant="inset" />
      <Collapse in={videoId}>
        <YouTube videoId={videoId} />
      </Collapse>
      <Typography className={classes.pitchtext}>
        {text}
      </Typography>
      <Divider variant="inset" />
      <Box display="flex">
        <Box flexGrow={1}>
          <Typography paragraph variant="caption" display="block">
            <strong>
              Target:
            </strong>
            {" "}
            {target}
          </Typography>
          <Typography paragraph variant="caption" display="block">
            <strong>
              Avoid:
            </strong>
            {" "}
            {avoid}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const PitchSkeleton = () => (
  <Box>
    <HorizontalArragement>
      <Thumbnail size={100} />
      <Box>
        <Skeleton height={10} width={80} />
        <Skeleton height={10} width={50} />
      </Box>
    </HorizontalArragement>
    <Divider variant="inset" />
    <Skeleton width="100%" height={300} />
    <Divider variant="inset" />
  </Box>
);

Pitch.Skeleton = PitchSkeleton;

export default Pitch;
