// var imgURL = chrome.runtime.getURL("images/myimage.png");

import * as domLoaded from "dom-loaded";
import { injectInternalScript } from "./inject";
import { ytRepository } from "./modules/yt-repository";
import { LastSeenVideoIdNotFoundError } from "./modules/yt-repository/getLastSeenVideoId";

(async () => {
  console.log("Hello From Extension");

  let lastSeenVideoId;
  try {
    lastSeenVideoId = await ytRepository.getLastSeenVideoId();
  } catch (error) {
    if (error instanceof LastSeenVideoIdNotFoundError) {
      lastSeenVideoId = null;
    } else {
      throw error;
    }
  }

  window.addEventListener("message", async event => {
    if (!event || event.source !== window) {
      return;
    }
    const message = event.data;
    if (!message || message.source !== "@youtube-pickup/dom") {
      return;
    }
    console.log("[content] Message Received", message);
    switch (message.type) {
      case "SAVE_LAST_SEEN_VIDEO_ID":
        const { lastSeenVideoId } = message.payload;
        if (!lastSeenVideoId) {
          throw new Error("Should not save last seen video id as null");
        }
        await ytRepository.saveLastSeenVideoId(lastSeenVideoId);
        console.log(`Saved last seen video id as "${lastSeenVideoId}"`);
        return;
    }
  });

  await domLoaded;
  injectInternalScript("dom.js");

  window.onload = () => {
    window.postMessage(
      {
        source: "@youtube-pickup/content",
        type: "FETCH_LAST_SEEN_VIDEO_ID_SUCCESS",
        payload: {
          lastSeenVideoId: lastSeenVideoId
        }
      },
      "*"
    );
  };
})();
