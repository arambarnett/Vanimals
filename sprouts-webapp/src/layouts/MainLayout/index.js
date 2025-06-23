import { useTranslation } from "i18n";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Container,
  // Button,
  Box,
  // Avatar,
  Grid,
  Typography,
  Link,
  Divider,
  // Hidden,
} from "@material-ui/core";
import { Instagram, Twitter } from "@material-ui/icons";
import ActiveLink from "components/ActiveLink";
// import HorizontalArragement from "components/HorizontalArragement";
// import ProfilePopover from "components/MagicButtons/ProfilePopover";
import routes from "routes";
// import { useSession } from "store/Session";
// import AuthButton from "components/Auth/AuthButton";

import VanimalLogo from "assets/footer/Vanimals.svg";
import Discord from "assets/footer/discord.png";
import CircleShape from "assets/footer/circle.png";
import Popoverize from "components/Popoverize";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  // btnLogin: {
  //   background: theme.color.white,
  //   borderRadius: 16,
  //   padding: "6px 48px",
  //   fontWeight: "bold",
  //   "&:hover": {
  //     background: theme.color.primary,
  //     color: theme.color.white,
  //   },
  // },
  footer: {
    backgroundImage: `url('${CircleShape.src}')`,
    background: theme.color.white,
    padding: "4rem 4rem 8rem 4rem",
    boxSizing: "content-box",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "bottom center",
  },
  socialMedia: {
    "& svg": {
      color: theme.color.white,
      background: theme.color.primary,
      borderRadius: "50%",
      padding: 7,
      fontSize: 45,
    },
    "& img": {
      color: theme.color.white,
      background: theme.color.primary,
      borderRadius: "50%",
      padding: 9,
    },
  },
  content: {
    flex: 1,
  },
  subNavbarLinks: {
    display: "flex",
    flexDirection: "column",
    "& a": {
      with: theme.size.fullWidth,
    },
  },
}));

const Desktop = ({ children }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  // const session = useSession();

  const displayCollectionNavigationLinks = (item) => (
    <Popoverize
      key={item}
      options={(
        <Box className={classes.subNavbarLinks}>
          <ActiveLink href={routes[item].MY_VANIMALS} title={t("MY_VANIMALS")} subItem />
          <ActiveLink href={routes[item].MY_EGGS} title={t("MY_EGGS")} subItem />
        </Box>
      )}
    >
      <ActiveLink key={item} href={routes[item]} title={t(item)} />
    </Popoverize>
  );

  const displayNavigationLinks = () => {
    const menuItems = ["HOME", "STORE", "VANIMALS", "COLLECTION", "FAQ"];

    return (
      <Box>
        {menuItems.map((item) => (
          item !== "COLLECTION"
            ? (
              <ActiveLink
                key={item}
                href={routes[item]}
                title={t(item)}
                className={classes.links}
              />
            )
            : displayCollectionNavigationLinks(item)
        ))}
      </Box>
    );
  };

  // const displaySettings = () => (
  //   <HorizontalArragement>
  //     {session.data ? (
  //       <ProfilePopover>
  //         <Button id="btnUserProfile">
  //           <Avatar src={session.data.user.avatar} />
  //           <Hidden xsDown>
  //             <Box ml={2}>
  //               <Typography variant="subtitle1">
  //                 {session.data.user.username}
  //               </Typography>
  //             </Box>
  //           </Hidden>
  //         </Button>
  //       </ProfilePopover>
  //     ) : (
  //       <AuthButton
  //         id="btnLogin"
  //         className={classes.btnLogin}
  //         variant="contained"
  //       >
  //         {t("LOGIN")}
  //       </AuthButton>
  //       // <Link passHref href={routes.SIGN_IN}>
  //       //   <Button id="btnLogin" variant="contained" color="primary">
  //       //     {t("LOGIN")}
  //       //   </Button>
  //       // </Link>
  //     )}
  //   </HorizontalArragement>
  // );

  const desktopView = () => (
    <Container maxWidth="xl">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        py={6}
      >
        {displayNavigationLinks()}
        {/* {displaySettings()} */}
      </Box>
    </Container>
  );

  return (
    <Box className={classes.container}>
      <AppBar position="static" color="transparent" elevation={0}>
        {desktopView()}
      </AppBar>
      <Box className={classes.content}>{children}</Box>
      <footer className={classes.footer}>
        <Grid container>
          <Grid item xs={12}>
            <Box maxWidth={325}>
              <img alt="Vanimal logo" src={VanimalLogo.src} height={75} />
              <Typography variant="body2" paragraph>
                Vanimals are NFT who’s rarity is paired with real animal
                populations
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              className={classes.socialMedia}
              display="flex"
              justifyContent="flex-end"
              gridGap={8}
            >
              <Link href="https://www.instagram.com/vanimalsnft/" target="_blank">
                <Instagram />
              </Link>
              <Link href="https://discord.com/invite/wJFXG8t9sN" target="_blank">
                <img alt="Discord logo" src={Discord.src} width={45} height={45} />
              </Link>
              <Link href="https://twitter.com/vanimalsgame" target="_blank">
                <Twitter />
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              © Copyright 2021, Vanimals. | All right reserved
            </Typography>
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="flex-end" gridGap={8}>
              <Grid
                container
                justifyContent="flex-end"
                spacing={2}
                style={{ textAlign: "right" }}
              >
                <Grid item xs={12} md="auto">
                  <Link href="/faq" color="textPrimary">
                    FAQ
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Grid> */}
        </Grid>
        <Box display="flex" justifyContent="space-between" />
      </footer>
    </Box>
  );
};

export default Desktop;
