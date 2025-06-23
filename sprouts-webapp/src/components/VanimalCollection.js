/* eslint-disable no-console */
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Paper,
  Typography,
  Fade,
} from "@material-ui/core";
import { hexToVec4 } from "utils";
import { useBlockchain } from "store/Blockchain";
import dynamic from "next/dynamic";
import VerticalArragement from "components/VerticalArragement";
import HorizontalArragement from "components/HorizontalArragement";
import APIEndpoints from "APIEndpoints";
import { useResource } from "hooks";
import { Pagination } from "@material-ui/lab";
import { useState } from "react";

// 3d
import Penguin3D from "assets/3D/models/penguin.glb";
import Chimpanzee3D from "assets/3D/models/chimpanzee.glb";
import Pigeon3D from "assets/3D/models/pidgeon.glb";
import Elephant3D from "assets/3D/models/elephant.glb";
import Tiger3D from "assets/3D/models/tiger.glb";
import Axolotl3D from "assets/3D/models/axolotl.glb";
import SplashLoading from "./SplashLoading";

const useStyles = makeStyles((theme) => ({
  summaryContainer: {
    padding: theme.spacing(2),
    marginTop: "20px",
    width: "300px",
    height: "450px",
  },
  pagination: {
    "& button": {
      color: theme.palette.primary.main,
    },
    "& li > div": {
      color: theme.palette.primary.main,
    },
  },
  boxes: {
    marginTop: theme.spacing(4),
  },
  vanimal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    flexDirection: "row",
    padding: theme.spacing(2),
  },
}));

const Model = dynamic(() => import("components/3DModel"), { ssr: false });

const VanimalsCollection = () => {
  const classes = useStyles();

  const mapVanimal3DModel = {
    axolotl: Axolotl3D,
    chimpanzee: Chimpanzee3D,
    elephant: Elephant3D,
    penguin: Penguin3D,
    pigeon: Pigeon3D,
    tiger: Tiger3D,
  };

  const itemsPerPage = 6;
  const { addressCKB } = useBlockchain();
  const [page, setPage] = useState(1);

  const {
    data,
    loading,
  } = useResource(addressCKB && APIEndpoints.COLLECTION.GET(
    { offset: (page - 1) * itemsPerPage, limit: itemsPerPage, type: "VANIMAL", blockchainAddress: addressCKB },
  ));
  
  if (loading || !addressCKB) { return <SplashLoading />; }

  const { data: items, totalCount } = data || {};

  const pagesLength = Math.ceil(totalCount / itemsPerPage);
  
  return (
    <>
      <HorizontalArragement className={classes.vanimal}>
        {[...(items || [])].map((result, i) => (
          <HorizontalArragement padding="15px" key={i}>
            <Fade in style={{ transitionDelay: 500 * i }}>
              <Paper className={classes.summaryContainer}>
                <HorizontalArragement justifyContent="center" spacing={1.5}>
                  <Typography variant="caption" className="font-bold" noWrap>
                    #
                    {" "}
                    {result.cellId}
                  </Typography>
                </HorizontalArragement>
                <VerticalArragement className={classes.boxes} justifyContent="center">
                  <Box display="flex" justifyContent="center" width="100%" height={300}>
                    <Box flex={1} width={1} display="flex" justifyContent="center">
                      <Box maxWidth={1}>
                        <Model
                          vanimal={result.breed}
                          glbFile={mapVanimal3DModel[result.breed]}
                          zoom={result.zoom}
                          onLoad={(modelViewer) => {
                            const { materials } = modelViewer.model;
                            materials.forEach((material, index) => {
                              material.pbrMetallicRoughness
                                .setBaseColorFactor(hexToVec4(result.colors[index]));
                            });
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </VerticalArragement>
                <VerticalArragement>
                  <HorizontalArragement justifyContent="center" spacing={3}>
                    <Typography className="font-bold" variant="h6">
                      {result.name}
                    </Typography>
                  </HorizontalArragement>
                  <HorizontalArragement justifyContent="space-evenly">
                    <Box>
                      <HorizontalArragement justifyContent="center" spacing={3}>
                        <Typography variant="body1" className="font-bold">
                          Gen
                          {" "}
                          {result.gen}
                        </Typography>
                      </HorizontalArragement>
                    </Box>
                    <Box>
                      <HorizontalArragement justifyContent="center" spacing={3}>
                        <Typography variant="body1" className="font-bold" color="primary">
                          {result.rarity}
                        </Typography>
                      </HorizontalArragement>
                    </Box>
                  </HorizontalArragement>
                </VerticalArragement>
              </Paper>
            </Fade>
          </HorizontalArragement>
        ))}
      </HorizontalArragement>
      <Box my={4}>
        <Pagination
          count={pagesLength}
          page={page}
          color="primary"
          className={classes.pagination}
          onChange={(e, val) => { setPage(val); }}
          hidePrevButton={false}
          shape="rounded"
        />
      </Box>
    </>
  );
};

export default VanimalsCollection;
