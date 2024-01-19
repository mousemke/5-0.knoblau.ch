import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(
  {
    contentWindow: {},
    seperator: {
      transition: "border-bottom 1s",

      "$contentWindow:hover &": {
        borderBottom: "1px solid rgb(36 210 235)"
      }
    },
    cardCount: {
      paddingTop: 16
    },
    cardLink: {
      justifyContent: "unset",
    },
    cardName: {
      paddingLeft: 16
    },
    cardType: {
      paddingTop: 16,
      minWidth: "20rem",
      paddingRight: 50
    },
    cardTypeTitle: {
      marginBottom: 8
    },
    mainboardWrapper: {
      display: "flex",
      flexWrap: "wrap"
    }
  },
  {
    name: "OneDeck"
  }
);

export default useStyles;
