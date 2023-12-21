import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(
  {
    link: {
      color: "#fff",

      "&:hover": {
        color: "rgb(245 150 245)"
      },
      "&:active": {
        color: "rgb(170 104 170)"
      }
    },
    buttonAsLink: {
      /* removes default button styles to appear as link */
      background: "none",
      border: "none",
      color: "#fff",
      cursor: "pointer",
      fontFamily: "monospace",
      padding: 0,
      textDecoration: "underline"
    }
  },
  {
    name: "Link"
  }
);

export default useStyles;
