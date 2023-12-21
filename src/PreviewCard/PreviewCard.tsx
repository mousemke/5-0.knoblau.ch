import React, { useMemo, useRef } from "react";
import {
  FrameSVGKranox,
  useFrameSVGAssemblingAnimation
} from "@arwes/react-frames";

import useStyles from "./PreviewCard.styles";

import type { ReactElement } from "react";
import type { PreviewCardProps } from "./PreviewCard.types";

const PreviewCard = (props: PreviewCardProps): ReactElement => {
  const { previewImage } = props;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const { onRender } = useFrameSVGAssemblingAnimation(svgRef);

  const classes = useStyles();

  const imageSlug = useMemo(() => encodeURIComponent(previewImage).replace(/%20/g, "+"), [previewImage]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.imageWrapper}>
        <img className={classes.image} src={`https://gatherer.wizards.com/Handlers/Image.ashx?type=card&name=${imageSlug}`} />
      </div>
      <FrameSVGKranox
        className={classes.frame}
        elementRef={svgRef}
        onRender={onRender}
        padding={4}
        strokeWidth={2}
        squareSize={12}
        smallLineLength={12}
        largeLineLength={48}
      />
    </div>
  );
};

export default PreviewCard;
