import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(
  {
    wrapperWindow: {
      width: "calc(80% - 300px)",
      marginLeft: "calc(325px + 10%)",
      paddingLeft: 30,

      "& > div > span": {
        width: "100%"
      }
    }
  },
  {
    name: "ContentWindow"
  }
);

export default useStyles;
