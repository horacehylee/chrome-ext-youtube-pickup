import { LAST_SEEN_VIDEO_ID_KEY } from "./constants";

export class LastSeenVideoIdNotFoundError extends Error {
  constructor() {
    super(`Last seen video id cannot be found`);
  }
}

export const getLastSeenVideoId = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([LAST_SEEN_VIDEO_ID_KEY], result => {
      console.log(result)
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      const videoId = result[LAST_SEEN_VIDEO_ID_KEY];
      if (!videoId) {
        reject(new LastSeenVideoIdNotFoundError());
        return;
      }
      resolve(videoId);
    });
  });
};
