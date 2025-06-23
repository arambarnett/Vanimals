import { useRouter } from "next/router";
import Link from "next/link";
import { Button, makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  activeItem: {
    "& span": {
      fontWeight: "font-bold",
    },
    "&::after": {
      content: "''",
      width: "calc(100% - 18px)",
      height: 2,
      position: "absolute",
      bottom: 0,
      background: theme.color.primary,
    },
  },
  activeSubItem: {
    background: "#c6bff87a",
  },
  links: {
    "& span": {
      fontSize: "1.2rem",
    },
  },
}));

const ActiveLink = ({ href, title, subItem, onClick }) => {
  const classes = useStyles();
  const { asPath } = useRouter();
  
  const isActive = () => (typeof href === "object" ? Object.values(href).includes(asPath) : href === asPath);

  return (
    <Link href={href} passHref>
      <Button
        className={clsx({ [subItem
          ? classes.activeSubItem
          : classes.activeItem]: isActive() }, classes.links)}
        onClick={onClick}
      >
        <Typography variant="button">{title}</Typography>
      </Button>
    </Link>
  );
};

export default ActiveLink;
