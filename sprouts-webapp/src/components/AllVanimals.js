/* eslint-disable no-console */
/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from "next/link";
import dynamic from "next/dynamic";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Typography,
  Divider,
  Button,
} from "@material-ui/core";
import withMainLayout from "hocs/withMainLayout";
import HorizontalArragement from "components/HorizontalArragement";
import { hexToVec4 } from "utils";

// icons
import Common from "assets/vanimals/Icons/common.svg";
import Lives from "assets/vanimals/Icons/lives.svg";
import Password from "assets/vanimals/Icons/statistics.svg";
import Population from "assets/vanimals/Icons/population.svg";
import Jungle from "assets/vanimals/Icons/map.svg";
import City from "assets/vanimals/Icons/estate.svg";
import Weather from "assets/vanimals/Icons/weather.svg";

// 3d
import Penguin3D from "assets/3D/models/penguin.glb";
import Chimpanzee3D from "assets/3D/models/chimpanzee.glb";
import Pigeon3D from "assets/3D/models/pidgeon.glb";
import Elephant3D from "assets/3D/models/elephant.glb";
import Tiger3D from "assets/3D/models/tiger.glb";
import Axolotl3D from "assets/3D/models/axolotl.glb";

const useStyles = makeStyles((theme) => ({
  [theme.breakpoints.down("sm")]: {
    container: {
      padding: "4rem 1rem",
    },
  },
  box: {
    background: "radial-gradient(90.16% 143.01% at 15.32% 21.04%, rgba(165, 239, 255, 0.2) 0%, rgba(110, 191, 244, 0.0447917) 77.08%, rgba(70, 144, 213, 0) 100%)",
    backdropFilter: "blur(39.2326px)",
    padding: "1rem",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    alignContent: "stretch",
    alignItems: "flex-start",
    marginTop: theme.spacing(2),
  },
  dividerHr: {
    width: "80%",
  },
  boxContent: {
    height: "700px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "stretch",
    marginBottom: theme.spacing(5),
  },
  directions: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  // buttonChangeColor: {
  //   margin: theme.spacing(1),
  // },
}));

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

const Model = dynamic(() => import("components/3DModel"), { ssr: false });

const AllVanimals = () => {
  const classes = useStyles();
 
  return (
    <Box className={classes.directions}>
      <HorizontalArragement justifyContent="center" width={400}>
        <Box className={classes.boxContent}>
          <Box>
            <Typography className="font-bold" variant="h6" color="primary">
              Emperor Penguin
            </Typography>
          </Box>
          {/* 3D model */}
          <Box flex={1} display="flex" justifyContent="center">
            <Box maxWidth={1}>
              <Model
                vanimal="penguin"
                glbFile={Penguin3D}
                onLoad={(modelViewer) => {
                  const { materials } = modelViewer.model;
                  materials.forEach((material, i) => {
                    material.pbrMetallicRoughness
                      .setBaseColorFactor(hexToVec4(Colors[i]?.color));
                  });
                }}
                zoom="60deg"
              />
            </Box>
          </Box>
          <Box className={classes.box}>
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Common.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Rare
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Lives.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Lives in the Antartic
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Password.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Near Threatened (NT)
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Population.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Population
                {" "}
                {">"}
                {" "}
                595,000
              </Typography>
            </HorizontalArragement>
            <HorizontalArragement padding="10px">
              <Box>
                <Button color="primary" variant="outlined">
                  <Link href="/vanimals/Emperor Penguin">
                    <a>See more details</a>
                  </Link>
                </Button>
              </Box>
            </HorizontalArragement>
          </Box>
        </Box>
      </HorizontalArragement>
      <HorizontalArragement justifyContent="center" width={400}>
        <Box className={classes.boxContent}>
          <Box>
            <Typography className="font-bold" variant="h6" color="primary">
              Chimpanzee
            </Typography>
          </Box>
          {/* 3D model */}
          <Box flex={1} display="flex" justifyContent="center">
            <Box maxWidth={1}>
              <Model
                vanimal="chimpanzee"
                glbFile={Chimpanzee3D}
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
          <Box className={classes.box}>
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Common.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Uncommon
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Lives.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Lives in the Montane Forest
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Jungle.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Endangered
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Population.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Population
                {" "}
                {">"}
                {" "}
                172,700 - 299,700
              </Typography>
            </HorizontalArragement>
            <HorizontalArragement padding="10px">
              <Box>
                <Button color="primary" variant="outlined">
                  <Link href="/vanimals/Chimpanzee">
                    <a>See more details</a>
                  </Link>
                </Button>
              </Box>
            </HorizontalArragement>
          </Box>
        </Box>
      </HorizontalArragement>
      <HorizontalArragement justifyContent="center" width={400}>
        <Box className={classes.boxContent}>
          <Box>
            <Typography className="font-bold" variant="h6" color="primary">
              NYC Pigeon
            </Typography>
          </Box>
          {/* 3D model */}
          <Box flex={1} display="flex" justifyContent="center">
            <Box maxWidth={1}>
              <Model
                vanimal="pigeon"
                glbFile={Pigeon3D}
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
          <Box className={classes.box}>
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Common.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Common
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Lives.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Lives in the cities
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={City.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Least Concern
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Population.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Population
                {" "}
                {">"}
                {" "}
                400 million
              </Typography>
            </HorizontalArragement>
            <HorizontalArragement padding="10px">
              <Box>
                <Button color="primary" variant="outlined">
                  <Link href="/vanimals/NYC Pigeon">
                    <a>See more details</a>
                  </Link>
                </Button>
              </Box>
            </HorizontalArragement>
          </Box>
        </Box>
      </HorizontalArragement>
      <HorizontalArragement justifyContent="center" width={400}>
        <Box className={classes.boxContent}>
          <Box>
            <Typography className="font-bold" variant="h6" color="primary">
              Axolotl
            </Typography>
          </Box>
          {/* 3D model */}
          <Box flex={1} display="flex" justifyContent="center">
            <Box maxWidth={1}>
              <Model
                vanimal="axolotl"
                glbFile={Axolotl3D}
                zoom="80deg"
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
          <Box className={classes.box}>
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Common.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Secret Rare
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Lives.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Lives in Wetlands (inland)
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Weather.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Critically Endangered
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Population.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Population
                {" "}
                {">"}
                {" "}
                50 - 1000
              </Typography>
            </HorizontalArragement>
            <HorizontalArragement padding="10px">
              <Box>
                <Button color="primary" variant="outlined">
                  <Link href="/vanimals/Axolotl">
                    <a>See more details</a>
                  </Link>
                </Button>
              </Box>
            </HorizontalArragement>
          </Box>
        </Box>
      </HorizontalArragement>
      <HorizontalArragement justifyContent="center" width={400}>
        <Box className={classes.boxContent}>
          <Box>
            <Typography className="font-bold" variant="h6" color="primary">
              Sumatran Elephant
            </Typography>
          </Box>
          {/* 3D model */}
          <Box flex={1} display="flex" justifyContent="center">
            <Box maxWidth={1}>
              <Model
                vanimal="elephant"
                glbFile={Elephant3D}
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
          <Box className={classes.box}>
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Common.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Ultra Rare
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Lives.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Located in Tropical Forests
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Jungle.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Critically Endangered
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Population.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Population
                {" "}
                {">"}
                {" "}
                2,400 - 2,800
              </Typography>
            </HorizontalArragement>
            <HorizontalArragement padding="10px">
              <Box>
                <Button color="primary" variant="outlined">
                  <Link href="/vanimals/Sumatran Elephant">
                    <a>See more details</a>
                  </Link>
                </Button>
              </Box>
            </HorizontalArragement>
          </Box>
        </Box>
      </HorizontalArragement>
      <HorizontalArragement justifyContent="center" width={400}>
        <Box className={classes.boxContent}>
          <Box>
            <Typography className="font-bold" variant="h6" color="primary">
              Bengal Tiger
            </Typography>
          </Box>
          {/* 3D model */}
          <Box flex={1} display="flex" justifyContent="center">
            <Box maxWidth={1}>
              <Model
                vanimal="tiger"
                glbFile={Tiger3D}
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
          <Box className={classes.box}>
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Common.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Super Rare
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Lives.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Lives in Tropical Rainforests
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Jungle.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Endangered
              </Typography>
            </HorizontalArragement>
            <Divider variant="middle" style={{ marginTop: 0, marginBottom: 0 }} className={classes.dividerHr} />
            <HorizontalArragement padding="10px">
              <img alt="Asset not found" src={Population.src} width={25} height={25} />
              <Typography className="font-bold" variant="caption">
                Population
                {" "}
                {">"}
                {" "}
                2,500 - 3,900
              </Typography>
            </HorizontalArragement>
            <HorizontalArragement padding="10px">
              <Box>
                <Button color="primary" variant="outlined">
                  <Link href="/vanimals/Bengal Tiger">
                    <a>See more details</a>
                  </Link>
                </Button>
              </Box>
            </HorizontalArragement>
          </Box>
        </Box>
      </HorizontalArragement>
    </Box>
  );
};
  
export default withMainLayout(AllVanimals);
