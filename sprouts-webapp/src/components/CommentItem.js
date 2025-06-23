import { Box, makeStyles, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import HorizontalArragement from "components/HorizontalArragement";
import formatDistance from "date-fns/formatDistanceToNow";
import SizableAvatar from "./SizableAvatar";

const useStyles = makeStyles((theme) => ({
  item: {
    display: "flex",
    alignItems: "center",
    minHeight: 100,
  },
  itemBody: {
    flexGrow: 1,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    textAlign: "left",
  },
}));
  
const CommentItem = ({ user, text, createdAt }) => (
  <HorizontalArragement mb={2}>
    <Box mb={1} flexGrow={1}>
      <HorizontalArragement mb={1}>
        <SizableAvatar src={user.avatar} size={30} />
        <Box>
          <Typography variant="body2" className="font-bold">
            {user.username}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {formatDistance(new Date(createdAt), { addSuffix: true })}
          </Typography>
        </Box>
      </HorizontalArragement>
      <Typography variant="body2">
        {text}
      </Typography>
    </Box>
  </HorizontalArragement>
);

const CommentSkeleton = () => {
  const classes = useStyles();
  return (
    <Box className={classes.item} fullWidth>
      <Skeleton
        variant="circle"
        height={50}
        width={50}
      />
      <Box className={classes.itemBody}>
        <Skeleton width={40} height={10} />
        <Skeleton width={80} height={10} />
      </Box>
      <Skeleton width={30} height={30} />
    </Box>
  );
};

CommentItem.Skeleton = CommentSkeleton;

export default CommentItem;
