import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(
  {
    separator: {
      height: 1,
      margin: "35px 5%",
      width: "90%",
      borderBottom: "1px solid rgb(235 36 235)"
    }
  },
  {
    name: "Seperator"
  }
);

export default useStyles;
