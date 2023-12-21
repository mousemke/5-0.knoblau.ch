import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(
  {
    link: {
      cursor: "pointer",
      padding: "0 16px",
      textDecoration: "none",
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      color: "#fff",

      "&:hover": {
        backgroundColor: "rgb(6, 26, 45, 50%)",
        color: "rgb(245 150 245)"
      },
      "&:active": {
        backgroundColor: "rgb(6, 10, 45, 50%)",
        color: "rgb(170, 104, 170)"
      }
    }
  },
  {
    name: "RowLink"
  }
);

export default useStyles;
