import type { FiveOhCard, FiveOhDeckList } from "../FiveOh/FiveOh.types";

export interface OneDeckProps {
  loadImage: (card: FiveOhCard) => () => void
  deck: FiveOhDeckList
}
