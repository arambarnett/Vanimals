import { Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import useQuotes from "hooks/useQuotes";

const QuotedPrice = ({ usd }) => {
  const { data } = useQuotes();

  if (!data) {
    return (
      <Skeleton
        width={150}
        height={30}
      />
    );
  }
  return (
    <Typography>
      {(usd / data.price).toFixed(2)}
    </Typography>
  );
};

export default QuotedPrice;
