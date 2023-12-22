import React from "react";

export interface RowLinkProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  id?: string;
  onClick?: () => void;
  onHover?: () => void;
  target?: string;
}
