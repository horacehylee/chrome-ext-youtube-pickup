import { ytSelector } from "./modules/yt-selector";
import { ytDomSelector } from "./modules/yt-dom-selector";
import { showToast } from "./modules/toast";
import { VideoNotFoundError } from "./modules/yt-dom-selector/selectVideoWithRetry";
import { domScroll } from "./modules/dom-scroll";
// import { ytRepository } from "./modules/yt-repository";
import { LastSeenVideoIdNotFoundError } from "./modules/yt-repository/getLastSeenVideoId";

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

window.addEventListener("message", event => {
  if (!event || event.source !== window) {
    return;
  }
  const message = event.data;
  if (!message || message.source !== "@youtube-pickup/content") {
    return;
  }
  console.log("[dom] Message Received", message);
  switch (message.type) {
    case "FETCH_LAST_SEEN_VIDEO_ID_SUCCESS":
      const { lastSeenVideoId } = message.payload;
      start(lastSeenVideoId);
      return;
  }
});

const start = (lastSeenVideoId: string) => {
  const ytInitialData = window["ytInitialData"];
  const ytVideos = ytSelector.queryVideos(ytInitialData);

  if (ytVideos.length === 0) {
    throw new Error(`No videos are found (ytVideos.length === 0)`);
  }

  const latestVideoid = ytVideos[0].videoId;
  window.postMessage(
    {
      source: "@youtube-pickup/dom",
      type: "SAVE_LAST_SEEN_VIDEO_ID",
      payload: {
        lastSeenVideoId: latestVideoid
      }
    },
    "*"
  );

  if (!lastSeenVideoId || lastSeenVideoId === "null") {
    console.log("Last seen video id is not set, skipping...");
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

  // const getIndex = () => {
  //   return 3;
  //   // return ytVideos.length = 2;
  // };
  // const selectedVideo = ytVideos[getIndex()];
  console.log("lastSeenVideo", lastSeenVideo);

  ytDomSelector
    .selectVideoWithRetry(lastSeenVideo, {
      delayMs: 500,
      times: 10
    })
    .subscribe(
      videoElement => {
        domScroll.scrollToElement(videoElement);
        const parent = ytDomSelector.selectVideoContainer(videoElement);
        console.log("videoElement parent", parent);
        parent.style.cssText = `
          border-top: 5px solid red;
        `;
      },
      (error: VideoNotFoundError) => {
        showToast({
          message: error.message,
          type: "error"
        });
        console.error(error.message, error.video);
      }
    );
};
