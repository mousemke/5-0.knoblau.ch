import React from "react";

export interface LinkProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  id?: string;
  onClick?: () => void;
  target?: string;
}
