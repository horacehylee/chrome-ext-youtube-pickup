import { ytSelector } from "./modules/yt-selector";
import { ytDomSelector } from "./modules/yt-dom-selector";
import { showToast } from "./modules/toast";
import { VideoNotFoundError } from "./modules/yt-dom-selector/selectVideoWithRetry";
import { domScroll } from "./modules/dom-scroll";
import { ytBridge } from "./modules/yt-bridge";

import * as logLevel from "loglevel";
import { addPrefix } from "./modules/log-util";
addPrefix(logLevel);
const log = logLevel.getLogger("dom");

const arrayToObject = <T>(
  array: Array<T>,
  idFieldSelector: (element: T) => string
): {
  [id: string]: T;
} =>
  array.reduce((obj, item) => {
    obj[idFieldSelector(item)] = item;
    return obj;
  }, {});

ytBridge.fetchLastSeenVideoId.observable().subscribe(payload => {
  const { lastSeenVideoId } = payload as any;
  start(lastSeenVideoId);
});

const start = (lastSeenVideoId: string) => {
  log.info("Starting...", {
    lastSeenVideoId
  });
  const ytInitialData = window["ytInitialData"];
  const ytVideos = ytSelector.queryVideos(ytInitialData);

  if (ytVideos.length === 0) {
    throw new Error(`No videos are found (ytVideos.length === 0)`);
  }

  const latestVideoid = ytVideos[0].videoId;
  ytBridge.saveLastSeenVideoId.post({
    lastSeenVideoId: latestVideoid
  });

  if (!lastSeenVideoId || lastSeenVideoId === "null") {
    log.info("Last seen video id is not set, skipping...");
    return;
  }

  // Select ytVideo
  const ytVideoDict = arrayToObject(ytVideos, video => video.videoId);
  // const lastSeenVideoId = ytVideos[3].videoId;
  const lastSeenVideo = ytVideoDict[lastSeenVideoId];
  if (!lastSeenVideo) {
    throw new Error(
      `Last seen video with video id "${lastSeenVideoId}" cannot be found`
    );
  }
  log.debug("lastSeenVideo", lastSeenVideo);

  ytDomSelector
    .selectVideoWithRetry(lastSeenVideo, {
      delayMs: 500,
      times: 10
    })
    .subscribe(
      videoElement => {
        domScroll.scrollToElement(videoElement);
        const parent = ytDomSelector.selectVideoContainer(videoElement);
        parent.style.cssText = `
          border-top: 5px solid red;
        `;
      },
      (error: VideoNotFoundError) => {
        showToast({
          message: error.message,
          type: "error"
        });
        log.error(error.message, error.video);
      }
    );
};
