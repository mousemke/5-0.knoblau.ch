import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(
  {
    "@global": {
      body: {
        backgroundColor: "#141515",
        fontFamily: "monospace",
        width: "100vw",
        margin: 0,
        color: "#ddd"
      }
    },
    accessibiiltyLabel: {
      left: 0,
      opacity: 0,
      position: "absolute",
      pointerEvents: "none",
      top: 0
    },
    backgroundWrapper: {
      position: "fixed",
      width: "100%",
      height: "100%"
    },
    filterInput: {
      border: "1px solid #e5e5e5",
      borderTop: "2px solid rgb(235 36 235)",
      boxShadow: "0px 1px 4px rgb(235 36 235)",
      color: "hsl(0, 0%, 20%)",
      fontSize: 16,
      padding: 8,
      width: 280,
      transition: "border-color 1s, box-shadow 1s",

      "&:hover": {
        borderColor: "rgb(36 210 235)",
        boxShadow: "0 1px 4px rgb(36 210 235)"
      }
    },
    titleWindow: {
      top: 30,
      width: 300,
      height: 100,
      marginBottom: 50,
      paddingBottom: 40
    },
    topBarsWrapper: {
      position: "sticky",
      width: "100%",
      top: 0
    },
    topBars: {
      display: "flex",
      justifyContent: "space-between"
    }
  },
  {
    name: "App"
  }
);

export default useStyles;
