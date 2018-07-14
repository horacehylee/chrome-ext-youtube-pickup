import { selectVideo } from "./selectVideo";
import { selectVideoWithRetry } from "./selectVideoWithRetry";
import { selectVideoContainer } from "./selectVideoContainer";

export const ytDomSelector = {
  selectVideo: selectVideo,
  selectVideoWithRetry: selectVideoWithRetry,
  selectVideoContainer: selectVideoContainer
};
