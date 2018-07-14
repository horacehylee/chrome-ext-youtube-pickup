import { ytSelector } from "./modules/yt-selector";
import { ytDomSelector } from "./modules/yt-dom-selector";
import { showToast } from "./modules/toast";
import { VideoNotFoundError } from "./modules/yt-dom-selector/selectVideoWithRetry";
import { domScroll } from "./modules/dom-scroll";

(() => {
  const ytInitialData = window["ytInitialData"];
  const ytVideos = ytSelector.queryVideos(ytInitialData);

  const getIndex = () => {
    return 2;
    // return ytVideos.length = 2;
  };
  const selectedVideo = ytVideos[getIndex()];
  console.log("selectedVideo", selectedVideo);

  ytDomSelector
    .selectVideoWithRetry(selectedVideo, {
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
})();
