import * as domLoaded from "dom-loaded";
import { injectInternalScript } from "./inject";
import { ytRepository } from "./modules/yt-repository";
import { LastSeenVideoIdNotFoundError } from "./modules/yt-repository/getLastSeenVideoId";
import { ytBridge } from "./modules/yt-bridge";

import * as logLevel from "loglevel";
import { addPrefix } from "./modules/log-util";
addPrefix(logLevel);
const log = logLevel.getLogger("content");

(async () => {
  log.info("Hello From Extension");

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

  ytBridge.saveLastSeenVideoId.observable().subscribe(async payload => {
    const { lastSeenVideoId } = payload;
    if (!lastSeenVideoId) {
      throw new Error("Should not save last seen video id as null");
    }
    await ytRepository.saveLastSeenVideoId(lastSeenVideoId);
    log.info(`Saved last seen video id as "${lastSeenVideoId}"`);
    return;
  });

  await domLoaded;
  injectInternalScript("dom.js");

  window.onload = () => {
    ytBridge.fetchLastSeenVideoId.post({
      lastSeenVideoId: lastSeenVideoId
    });
  };
})();
