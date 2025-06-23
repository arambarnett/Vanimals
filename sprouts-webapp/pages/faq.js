import { makeStyles } from "@material-ui/core/styles";
import {
  Box, Button, Container, Typography,
} from "@material-ui/core";
import withMainLayout from "hocs/withMainLayout";
import BaseScreen from "components/BaseScreen";
import VerticalArragement from "components/VerticalArragement";
import ChildrenFriendlyButton from "components/ChildrenFriendlyButton";

import { useState } from "react";

import Collapse from "@material-ui/core/Collapse";
import Paper from "@material-ui/core/Paper";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import FillBackground from "components/FillBackground";
import iconBreeding from "assets/faqs/crackedEgg.svg";
import iconBuying from "assets/faqs/buy.svg";
import iconVanimals from "assets/faqs/patitas.svg";
import iconAccount from "assets/faqs/iconAccount.svg";

import iconAccountWhite from "assets/faqs/iconAccountWhite.svg";
import iconVanimalsWhite from "assets/faqs/patitasWhite.svg";
import iconBuyingWhite from "assets/faqs/buyWhite.svg";
import iconBreedingWhite from "assets/faqs/crackedEggWhite.svg";

import HorizontalArragement from "components/HorizontalArragement";

const useStyles = makeStyles((theme) => ({
  hero: {
    minWidth: theme.size.fullViewportWidth,
    minHeight: theme.size.fullViewportHeight,
    marginBottom: "4rem",
  },
  innerContainer: {
    paddingTop: theme.spacing(4),
  },
  container: {
    padding: theme.spacing(2),
    width: "100%",
  },
  directions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    margin: theme.spacing(2),
  },
  boxButton: {
    margin: theme.spacing(2),
  },
  button: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
  },
  boxSections: {
    padding: theme.spacing(2),
  },
  img: {
    height: "25px",
    width: "25px",
    margin: theme.spacing(1),
  },
}));

const sectionBreeding = [
  {
    title: "Breeding",
    questions: [
      { text: "Can Vanimals be breeded?", answer: "Yes! Your first Vanimal will come inside an Egg, that after hatching will spawn a random Vanimal from the pool. In the future, you’ll be able to breed your Vanimals of the same species to get new ones with different color patterns (and rarity), to further improve your collection without the need of eggs or buy them directly from other caretakers in the marketplace." },
    ],
  },
];

const sectionBuying = [
  {
    title: "Buying and selling",
    questions: [
      { text: "How many Vanimals will there be at launch?", answer: "At launch we’ll be having a roster of 6 Vanimals, each with their own identity and a very rare special one for the most lucky caretakers." },
    ],
  },
];

const sectionVanimals = [
  {
    title: "Vanimals",
    questions: [
      { text: "What is a Vanimal?", answer: "A Vanimal is a virtual pet modeled after their real life counterpart. Each Vanimal is minted in the form of an NFT that stores all the data and their current owner for everyone to see." },
      { text: "Is there any foundation or charity for real life animals that will get support from Vanimals?", answer: "TBA" },
    ],
  },
];

const sectionAccount = [
  {
    title: "What do I need to play?",
    questions: [
      { text: "In which blockchain do the Vanimals live? ", answer: "Vanimals reside in the Nervos Blockchain, where all the metadata is stored." },
    ],
  },
];

const CollapsablePaper = ({ question, answer }) => {
  const [visible, setVisible] = useState(false);
  const classes = useStyles();

  const toggle = () => setVisible(!visible);
  return (
    <ChildrenFriendlyButton noPadding onClick={toggle} fullWidth>
      <Paper className={classes.container} elevation={0}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography className="font-medium">
            {question}
          </Typography>
          {visible ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </Box>
        <Collapse in={visible}>
          <Box className={classes.innerContainer}>
            <Typography variant="body2">
              {answer}
            </Typography>
          </Box>
        </Collapse>
      </Paper>
    </ChildrenFriendlyButton>
  );
};

const FAQ = () => {
  const classes = useStyles();
  
  const [buttonAccount, setButtonAccount] = useState(true);
  const [buttonBreeding, setButtonBreeding] = useState(true);
  const [buttonBuying, setButtonBuying] = useState(true);
  const [buttonVanimals, setButtonVanimals] = useState(true);

  return (
    <BaseScreen title="Frequent Questions" className={classes.hero}>
      <FillBackground />
      <Container maxWidth="md">
        <HorizontalArragement className={classes.directions}>
          <Box className={classes.boxButton}>

            <Button
              onClick={() => { setButtonAccount(!buttonAccount); }}
              className={classes.button}
              color={buttonAccount ? "primary" : "default"}
              variant="contained"
            >
              {buttonAccount
                ? <img alt="Asset not found" src={iconAccountWhite.src} className={classes.img} />
                : <img alt="Asset not found" src={iconAccount.src} className={classes.img} />}
              My Account
            </Button>
          </Box>
          <Box className={classes.boxButton}>
            
            <Button
              onClick={() => { setButtonBuying(!buttonBuying); }}
              className={classes.button}
              color={buttonBuying ? "primary" : "default"}
              variant="contained"
            >
              {buttonBuying
                ? <img alt="Asset not found" src={iconBuyingWhite.src} className={classes.img} />
                : <img alt="Asset not found" src={iconBuying.src} className={classes.img} />}
              Buying and Selling
            </Button>
          </Box>
          <Box className={classes.boxButton}>
            <Button
              onClick={() => { setButtonBreeding(!buttonBreeding); }}
              className={classes.button}
              color={buttonBreeding ? "primary" : "default"}
              variant="contained"
            >
              {buttonBreeding
                ? <img alt="Asset not found" src={iconBreedingWhite.src} className={classes.img} />
                : <img alt="Asset not found" src={iconBreeding.src} className={classes.img} />}
              Breeding
            </Button>
          </Box>
          <Box className={classes.boxButton}>
            <Button
              onClick={() => { setButtonVanimals(!buttonVanimals); }}
              className={classes.button}
              color={buttonVanimals ? "primary" : "default"}
              variant="contained"
            >
              {buttonVanimals
                ? <img alt="Asset not found" src={iconVanimalsWhite.src} className={classes.img} />
                : <img alt="Asset not found" src={iconVanimals.src} className={classes.img} />}
              Vanimals
            </Button>
          </Box>
        </HorizontalArragement>
        <Box className={classes.boxSections}>
          { buttonAccount
            ? sectionAccount
              ? (
                <VerticalArragement spacing={7}>
                  {sectionAccount.map((section, i) => (
                    <Box key={i}>
                      <Typography variant="h5" color="primary" paragraph className="font-bold">
                        {section.title}
                      </Typography>
                      <VerticalArragement spacing={2}>
                        {section.questions.map((question, i) => (
                          <CollapsablePaper
                            key={i}
                            question={question.text}
                            answer={question.answer}
                          />
                        ))}
                      </VerticalArragement>
                    </Box>
                  ))}
                </VerticalArragement>
              )
              : null
            : null}
        </Box>
        <Box className={classes.boxSections}>
          { buttonBuying
            ? sectionBuying
              ? (
                <VerticalArragement spacing={7}>
                  {sectionBuying.map((section, i) => (
                    <Box key={i}>
                      <Typography variant="h5" color="primary" paragraph className="font-bold">
                        {section.title}
                      </Typography>
                      <VerticalArragement spacing={2}>
                        {section.questions.map((question, i) => (
                          <CollapsablePaper
                            key={i}
                            question={question.text}
                            answer={question.answer}
                          />
                        ))}
                      </VerticalArragement>
                    </Box>
                  ))}
                </VerticalArragement>
              )
              : null
            : null}
        </Box>
        <Box className={classes.boxSections}>
          { buttonBreeding
            ? sectionBreeding
              ? (
                <VerticalArragement spacing={7}>
                  {sectionBreeding.map((section, i) => (
                    <Box key={i}>
                      <Typography variant="h5" color="primary" paragraph className="font-bold">
                        {section.title}
                      </Typography>
                      <VerticalArragement spacing={2}>
                        {section.questions.map((question, i) => (
                          <CollapsablePaper
                            key={i}
                            question={question.text}
                            answer={question.answer}
                          />
                        ))}
                      </VerticalArragement>
                    </Box>
                  ))}
                </VerticalArragement>
              )
              : null
            : null}
        </Box>
        <Box className={classes.boxSections}>
          { buttonVanimals
            ? sectionVanimals
              ? (
                <VerticalArragement spacing={7}>
                  {sectionVanimals.map((section, i) => (
                    <Box key={i}>
                      <Typography variant="h5" color="primary" paragraph className="font-bold">
                        {section.title}
                      </Typography>
                      <VerticalArragement spacing={2}>
                        {section.questions.map((question, i) => (
                          <CollapsablePaper
                            key={i}
                            question={question.text}
                            answer={question.answer}
                          />
                        ))}
                      </VerticalArragement>
                    </Box>
                  ))}
                </VerticalArragement>
              )
              : null
            : null}
        </Box>
        <Box height={200} />
      </Container>
    </BaseScreen>
  );
};

export default withMainLayout(FAQ);
