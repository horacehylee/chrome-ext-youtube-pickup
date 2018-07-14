import { LAST_SEEN_VIDEO_ID_KEY } from "./constants";

export const saveLastSeenVideoId = (videoId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(
      {
        [LAST_SEEN_VIDEO_ID_KEY]: videoId
      },
      () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve();
      }
    );
  });
};
