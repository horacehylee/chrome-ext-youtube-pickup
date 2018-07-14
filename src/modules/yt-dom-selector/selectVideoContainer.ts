import { getClosest } from "../dom-utils";

export const selectVideoContainer = (element: HTMLElement) => {
  return getClosest(element, "ytd-item-section-renderer");
};
