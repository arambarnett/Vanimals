/* eslint-disable react/no-unescaped-entities */
import BaseScreen from "components/BaseScreen";
import { Box, Button, Divider, makeStyles, Typography } from "@material-ui/core";
import { Timer, ArrowBack, Share } from "@material-ui/icons";
import VanimalSkills from "components/SubComponents/VanimalSkills";
import FillBackground from "components/FillBackground";
import dynamic from "next/dynamic";
import withMainLayout from "hocs/withMainLayout";
import { hexToVec4 } from "utils";
import { useRouter } from "next/router";
import HorizontalArragement from "components/HorizontalArragement";
import Leaf from "assets/vanimals/Icons/map.svg";
import Lives from "assets/vanimals/Icons/lives.svg";
import Password from "assets/vanimals/Icons/statistics.svg";
import Population from "assets/vanimals/Icons/population.svg";
import Common from "assets/vanimals/Icons/common.svg";
import Bubbles from "assets/vanimals/Icons/bubbles.svg";

// posters
import Axolotl from "assets/3D/vr/axolotl.jpg";
import Chimpanzee from "assets/3D/vr/chimpanzee.jpg";
import Elephant from "assets/3D/vr/elephant.jpg";
import Penguin from "assets/3D/vr/penguin.jpg";
import Pigeon from "assets/3D/vr/pigeon.jpg";
import Tiger from "assets/3D/vr/tiger.jpg";

// 3d
import Penguin3D from "assets/3D/models/penguin.glb";
import Chimpanzee3D from "assets/3D/models/chimpanzee.glb";
import Pigeon3D from "assets/3D/models/pidgeon.glb";
import Elephant3D from "assets/3D/models/elephant.glb";
import Tiger3D from "assets/3D/models/tiger.glb";
import Axolotl3D from "assets/3D/models/axolotl.glb";

import dataJson from "data/vanimals-details.json";

const useStyles = makeStyles((theme) => ({
  imgBackground: {
    height: "500px",
    filter: "blur(15px)",
    "& img": {
      width: theme.size.fullWidth,
      height: theme.size.fullHeight,
    },
  },
  directions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    flexDirection: "row",
    padding: theme.spacing(2),
  },
  directionsDescription: {
    display: "flex",
    padding: theme.spacing(1),
  },
  text: {
    padding: theme.spacing(1),
  },
  boxText: {
    width: "90%",
  },
  boxAugmentedReality: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "flex-start",
  },
  boxData: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "column",
  },
  textDescription: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.spacing(1),
  },
  boxImg: {
    padding: theme.spacing(2),
  },
  imgLogos: {
    marginRight: theme.spacing(1),
    alignItems: "center",
  },
  vanimalImg: {
    width: 300,
    height: 300,
  },
}));

const Model = dynamic(() => import("components/3DModel"), { ssr: false });

const VanimalDetail = () => {
  const classes = useStyles();
  const router = useRouter();
  const { vanimal } = router.query;
  
  const {
    name,
    nickname,
    skills,
    cellId,
    model,
    gen,
    hatching,
    biological,
    conservation,
    status,
    lives,
    inhabit,
    population,
    localName,
  } = dataJson?.find((v) => v.name === vanimal) || {};

  const mapVanimal3DModel = {
    axolotl: Axolotl3D,
    chimpanzee: Chimpanzee3D,
    elephant: Elephant3D,
    penguin: Penguin3D,
    pigeon: Pigeon3D,
    tiger: Tiger3D,
  };
  const Colors = [
    {
      color: "#2C3539",
    },
    {
      color: "#3AA5C3",
    },
    {
      color: "#C44C8A",
    },
    {
      color: "#4B4E85",
    },
    {
      color: "#4B4E85",
    },
    {
      color: "#4B4E85",
    },
    {
      color: "#87CEEB",
    },
    {
      color: "#FFBF00",
    },
    {
      color: "#FFBF00",
    },
    {
      color: "#FFBF00",
    },
  ];
  const mapVanimalScenery = {
    axolotl: Axolotl,
    chimpanzee: Chimpanzee,
    elephant: Elephant,
    penguin: Penguin,
    pigeon: Pigeon,
    tiger: Tiger,
  };

  const onBackClick = () => {
    router.back();
  };

  return (
    <>
      <BaseScreen title={name} subtitle={nickname}>
        <Button
          onClick={onBackClick}
          startIcon={
            <ArrowBack />
          }
        >
          <Typography>
            Back
          </Typography>
        </Button>
        <FillBackground />
        <Box className={classes.directions}>
          <Box className={classes.VanimalSkills}>
            <VanimalSkills
              skills={skills || []}
            />
          </Box>
          <Box className={classes.boxData}>
            <HorizontalArragement justifyContent="center">
              <Typography className="font-bold" padding={1} variant="body2">
                #
                {cellId}
              </Typography>
              <Typography className={classes.text} variant="body2">|</Typography>
              <Typography className={classes.text} variant="body1">
                {gen}
              </Typography>
              <Typography className={classes.text} variant="body2">|</Typography>
              <Timer color="primary" fontSize="small" />
              <Typography className={classes.text} variant="body1">
                Hatching (
                {hatching}
                )
              </Typography>
              <Share color="primary" fontSize="small" />
            </HorizontalArragement>
            {model
              ? (
                <Box className={classes.boxImg}>
                  {/* 3D model */}
                  <Box className={classes.vanimalImg} flex={1} display="flex" justifyContent="center">
                    <Box maxWidth={1}>
                      <Model
                        vanimal={localName}
                        glbFile={mapVanimal3DModel[localName]}
                        onLoad={(modelViewer) => {
                          const { materials } = modelViewer.model;
                          materials.forEach((material, i) => {
                            material.pbrMetallicRoughness
                              .setBaseColorFactor(hexToVec4(Colors[i]?.color));
                          });
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              )
              : (
                <Box flex={1} display="flex" justifyContent="center">
                  <Box maxWidth={1}>
                    <Model glbFile={model} />
                  </Box>
                </Box>
              )}
          </Box>
        </Box>
        <Box className={classes.directions}>
          <Box className={classes.boxText} flexDirection="column">
            <Box display="flex" alignItems="center">
              <img
                alt="Asset not found"
                className={classes.imgLogos}
                src={Bubbles.src}
                width={20}
                height={20}
              />
              <Typography className="font-bold" variant="subtitle1">Biological</Typography>
            </Box>
            <Box className={classes.textDescription}>
              <Typography>
                {biological}
              </Typography>
            </Box>
          </Box>
          <Box className={classes.boxText} flexDirection="column">
            <Box display="flex" alignItems="center">
              <img
                alt="Asset not found"
                className={classes.imgLogos}
                src={Leaf.src}
                width={20}
                height={20}
              />
              <Typography className="font-bold" variant="subtitle1">Conservation</Typography>
            </Box>
            <Box className={classes.textDescription}>
              <Typography>
                {conservation}
              </Typography>
            </Box>
          </Box>
          <Box className={classes.boxText} flexDirection="column">
            <Typography
              className="font-bold"
              variant="subtitle1"
              color="primary"
            >
              Data
            </Typography>
            <Box className={classes.textDescription}>
              <Box display="flex" alignItems="center">
                <img
                  alt="Asset not found"
                  className={classes.imgLogos}
                  src={Common.src}
                  width={15}
                  height={15}
                />
                <Typography className="font-bold" variant="body1">
                  {status}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <img
                  alt="Asset not found"
                  className={classes.imgLogos}
                  src={Lives.src}
                  width={15}
                  height={15}
                />
                <Typography className="font-bold" variant="body1">
                  {inhabit}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <img
                  alt="Asset not found"
                  className={classes.imgLogos}
                  src={Password.src}
                  width={15}
                  height={15}
                />
                <Typography className="font-bold" variant="body1">
                  {lives}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <img
                  alt="Asset not found"
                  className={classes.imgLogos}
                  src={Population.src}
                  width={15}
                  height={15}
                />
                <Typography className="font-bold" variant="body1">
                  Population
                  {" "}
                  {">"}
                  {" "}
                  {population}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box height={650}>
          <Typography variant="h5" color="primary" className="font-bold">Augmented Reality</Typography>
          <Divider />
          <Typography
            variant="h6"
            className="font-bold"
          >
            Coming soon...
          </Typography>
          <Box
            mt={3}
            className={classes.imgBackground}
          >
            <img
              alt="iamge not found"
              src={mapVanimalScenery[localName]?.src}
            />
          </Box>
        </Box>
        <Divider />
        <Box className={classes.directionsDescription}>
          <Box className={classes.boxAugmentedReality} flexDirection="column">
            <img
              alt="Asset not found"
              className={classes.imgLogos}
              src={Bubbles.src}
              width={20}
              height={20}
            />
            <Typography className="font-bold" variant="subtitle1">What is augmented reaility</Typography>
            <Box className={classes.textDescription}>
              <Typography>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
                praesentium voluptatum deleniti atque corrupti
                quos dolores et quas molestias excepturi
                sint occaecati cupiditate non provident
              </Typography>
            </Box>
          </Box>
          <Box className={classes.boxAugmentedReality} flexDirection="column">
            <img
              alt="Asset not found"
              className={classes.imgLogos}
              src={Bubbles.src}
              width={20}
              height={20}
            />
            <Typography className="font-bold" variant="subtitle1">What you can do</Typography>
            <Box className={classes.textDescription}>
              <Box display="flex" alignItems="center">
                <img
                  alt="Asset not found"
                  className={classes.imgLogos}
                  src={Common.src}
                  width={15}
                  height={15}
                />
                <Box padding={1}>
                  <Typography className="font-bold" variant="body1">
                    Miles away
                  </Typography>
                </Box>
                <Box padding={1}>
                  <Typography className="font-bold" color="primary">
                    14,600
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <img
                  alt="Asset not found"
                  className={classes.imgLogos}
                  src={Lives.src}
                  width={15}
                  height={15}
                />
                <Box padding={1}>
                  <Typography className="font-bold" variant="body1">
                    Pens
                  </Typography>
                </Box>
                <Box padding={1} ml={2.8}>
                  <Typography className="font-bold" color="primary">
                    10,000
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <img
                  alt="Asset not found"
                  className={classes.imgLogos}
                  src={Password.src}
                  width={15}
                  height={15}
                />
                <Box padding={1}>
                  <Typography className="font-bold" variant="body1">
                    Body mass
                  </Typography>
                </Box>
                <Box padding={1}>
                  <Typography className="font-bold" color="primary">
                    20 - 45 kg
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </BaseScreen>

    </>
  );
};

export default withMainLayout(VanimalDetail);
