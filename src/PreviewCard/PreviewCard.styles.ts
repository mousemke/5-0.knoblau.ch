import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(
  {
    frame: {
      "& path[data-name=bg]": {
        color: "transparent",
        filter: "drop-shadow(0 0 4px rgba(45, 6, 36, 0.5))"
      },
      "& path[data-name=line]": {
        transition: "color 1s",
        color: "rgb(235 36 235)",
        filter: "drop-shadow(0 0 4px rgb(235 36 235))"
      }
    },
    imageWrapper: {
      padding: 10
    },
    wrapper: {
      position: "fixed",
      maxWidth: "calc(20% + 100px)",
      margin: 50,
      padding: 20,
      marginTop: -3,

      "&:hover": {
        "& $frame path[data-name=line]": {
          color: "rgb(36 210 235)",
          filter: "drop-shadow(0 0 4px rgb(36 210 235))"
        }
      }
    },
    image: {
      objectFit: "cover",
      width: "100%"
    }
  },
  {
    name: "PreviewCard"
  }
);

export default useStyles;
