import { makeStyles, useTheme } from "@material-ui/core/styles";
import { InView } from "react-intersection-observer";
import clsx from "clsx";
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  Grow,
  Slide,
  useMediaQuery,
} from "@material-ui/core";
import withMainLayout from "hocs/withMainLayout";
import VanimalSkills from "components/SubComponents/VanimalSkills";
import VanimalCollectionCarousel from "components/SubComponents/VanimalCollectionCarousel";

import bgImage from "assets/landing/bg.png";
import vanimalsGroupImage from "assets/landing/fondo/fondo1.png";
import birdImage from "assets/landing/bird/homepidgeon.png";
import tigerImage from "assets/landing/tiger/hometiger5.png";
import eggAnimation from "assets/landing/egg.gif";
import birdCollection from "assets/landing/carrousel/pidgeon2.png";
import tigerCollection from "assets/landing/carrousel/tiger.png";
import monkeyCollection from "assets/landing/carrousel/chimp2.png";
import axolotlCollection from "assets/landing/carrousel/axolot1.png";
import elephantCollection from "assets/landing/carrousel/elefant1.png";
import penguinCollection from "assets/landing/carrousel/penguin.png";

import FillBackground from "components/FillBackground";

const useStyles = makeStyles((theme) => ({
  hero: {
    maxWidth: theme.size.fullViewportWidth,
    backgroundImage: `url('${bgImage.src}')`,
    backgroundRepeat: "no-repeat",
    backgroundPositionY: "120vh",
    backgroundSize: "contain",
  },
  container: {
    boxSizing: "border-box",
    padding: "4rem",
  },
  
  fullHeight: {
    minHeight: theme.size.fullHeightMinus("10rem"),
  },
  lightContent: {
    backgroundColor: "#ffffffb3",
  },
  [theme.breakpoints.down("sm")]: {
    container: {
      padding: "4rem 1rem",
    },
  },
}));

const Landing = () => {
  const classes = useStyles();
  const theme = useTheme();

  const smDown = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container disableGutters className={classes.hero}>
      <FillBackground />
      <Box>
        {/* main section */}
        <InView triggerOnce initialInView delay={400}>
          {({ inView, ref }) => (
            <Grid
              ref={ref}
              container
              className={clsx(classes.container, classes.fullHeight)}
            >
              <Grow in={inView} {...(inView ? { timeout: 1000 } : {})}>
                <Grid item xs={12} md={3}>
                  <Box
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="start"
                    display="flex"
                    height={1}
                  >
                    <Typography className="font-bold" variant="h2" paragraph>
                      Vanimals
                    </Typography>
                    <Typography className="font-normal" variant="h6" paragraph>
                      Vanimals are NFTs who&apos;s rarity is paired to real
                      animal populations.
                    </Typography>
                  </Box>
                </Grid>
              </Grow>

              <Grow in={inView} {...(inView ? { timeout: 1000 } : {})}>
                <Grid item xs={12} md={9}>
                  <Box
                    flexDirection="row"
                    justifyContent="end"
                    alignItems="center"
                    display="flex"
                    height={1}
                  >
                    <img
                      alt="Asset not found"
                      src={vanimalsGroupImage.src}
                      width="100%"
                      style={{ transform: smDown ? "scale(1.25)" : "scale(1)" }}
                    />
                  </Box>
                </Grid>
              </Grow>
            </Grid>
          )}
        </InView>

        {/* about vanimals section */}
        <Grid container className={classes.container}>
          <InView triggerOnce delay={400} threshold={0.5}>
            {({ inView, ref }) => (
              <Grid ref={ref} container>
                <Slide in={inView} direction="up" timeout={800}>
                  <Grid item xs={12} md={4}>
                    <Box
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="start"
                      display="flex"
                      height={1}
                    >
                      <Typography className="font-bold" variant="h4" paragraph>
                        Your Vanimal, your fingerprint
                      </Typography>
                      <Typography variant="subtitle1" paragraph>
                        Every Vanimal is authentically yours. The integrity of
                        its DNA is publicly visible for all to see, showing both
                        your ownership and your Vanimal&apos;s genetic heritage.
                        This means the value you’re creating by trading,
                        breeding, and conserving can never be duplicated, never
                        be forged, and always bears your fingerprint.
                      </Typography>
                    </Box>
                  </Grid>
                </Slide>

                <Slide in={inView} direction="up" timeout={800}>
                  <Grid item xs={12} md={8}>
                    <Box
                      flexDirection="column"
                      alignItems="end"
                      position="relative"
                      display="flex"
                      height={1}
                    >
                      <img
                        alt="Asset not found"
                        src={birdImage.src}
                        width="90%"
                        style={{
                          right: smDown ? "-1rem" : "-4rem",
                          position: "relative",
                        }}
                      />
                    </Box>
                  </Grid>
                </Slide>
              </Grid>
            )}
          </InView>
        </Grid>

        {/* breed vanimals section */}
        <InView triggerOnce delay={400} threshold={0.5}>
          {({ inView, ref }) => (
            <Box
              ref={ref}
              className={clsx(classes.container, classes.lightContent)}
            >
              <Slide in={inView} direction="up" timeout={800}>
                <Grid container alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Box display="flex" justifyContent="center">
                      <img
                        alt="Asset not found"
                        src={eggAnimation.src}
                        width="auto"
                        height={400}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Typography className="font-bold" variant="h4" paragraph>
                      Breed vanimals
                    </Typography>
                    <Typography variant="subtitle1" paragraph>
                      Collect, breed, and conserve the most valuable Vanimals to
                      ascend to the top of the herd.
                    </Typography>
                    <Typography variant="subtitle1" paragraph>
                      By breeding the rarest Vanimals in the world (the rarest
                      Vanimals have the most unique colors), you can become the
                      top conservationist on the planet, recognized far and wide
                      across the Vanimals universe for your conservationist
                      prowess.
                    </Typography>
                    <Button variant="contained" color="primary" size="large">
                      Breed now
                    </Button>
                  </Grid>
                </Grid>
              </Slide>
            </Box>
          )}
        </InView>

        {/* skills section */}
        <InView triggerOnce delay={400} threshold={0.5}>
          {({ inView, ref }) => (
            <Box ref={ref}>
              <Slide in={inView} direction="up" timeout={800}>
                <Grid container className={classes.container}>
                  <Grid item xs={12} md={3}>
                    <Box
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="start"
                      display="flex"
                      height={1}
                    >
                      <Typography className="font-bold" variant="h4" paragraph>
                        All vanimals
                      </Typography>
                      <Typography variant="subtitle1" paragraph>
                        The genetics include skills
                      </Typography>
                      <Button variant="contained" color="primary" size="large">
                        Go to Collection
                      </Button>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <Box
                      justifyContent="center"
                      flexDirection="column"
                      alignItems="end"
                      display="flex"
                      height={1}
                    >
                      <img
                        alt="Asset not found"
                        src={tigerImage.src}
                        width="100%"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box
                      justifyContent="center"
                      flexDirection="column"
                      alignItems="end"
                      display="flex"
                      height={1}
                    >
                      <VanimalSkills
                        skills={[
                          { title: "Reproductive speed", value: 20 },
                          { title: "Tenacity", value: 80 },
                          { title: "Intelligence", value: 40 },
                          { title: "Versatility", value: 40 },
                          { title: "Size", value: 20 },
                          { title: "Speed", value: 80 },
                        ]}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Slide>
            </Box>
          )}
        </InView>

        {/* collection section */}
        <InView triggerOnce delay={400} threshold={0.5}>
          {({ inView, ref }) => (
            <Box ref={ref}>
              <Slide in={inView} direction="up" timeout={800}>
                <Grid container className={classes.container}>
                  <Grid item xs={12}>
                    <Box
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      display="flex"
                      height={1}
                    >
                      <Typography className="font-bold" variant="h4" paragraph>
                        Vanimals collections
                      </Typography>
                      <VanimalCollectionCarousel
                        items={[
                          {
                            name: "bird",
                            image: birdCollection.src,
                            description:
                              "Easily the most common animal in NYC. Although they tend to be a nuisance they are still adorable.",
                          },
                          {
                            name: "tiger",
                            image: tigerCollection.src,
                            description:
                              "The apex predators of forest ecosystems, inspiring both fear and recognition for their amazing looks and colors.",
                          },
                          {
                            name: "monkey",
                            image: monkeyCollection.src,
                            description:
                              "Our GreatGreat (really great) Cousins that still inhabit the wilderness.",
                          },
                          {
                            name: "penguin",
                            image: penguinCollection.src,
                            description:
                              "Aren’t they the cutest thing you saw today? The unrecognized kings of temperate and cold climates.",
                          },
                          {
                            name: "elephant",
                            image: elephantCollection.src,
                            description:
                              "A truly magnificent creature that descends from the Asian elephant.",
                          },
                          {
                            name: "axolotl",
                            image: axolotlCollection.src,
                            description:
                              "The cute boys of the Mexican bioma. They are natives of the Valley of Mexico.",
                          },
                        ]}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Slide>
            </Box>
          )}
        </InView>
      </Box>
    </Container>
  );
};

export default withMainLayout(Landing);
