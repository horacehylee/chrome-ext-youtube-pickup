import { createBridge } from "./createBridge";

export const ytBridge = {
  fetchLastSeenVideoId: createBridge<{ lastSeenVideoId: string }>(
    "FETCH_LAST_SEEN_VIDEO_ID_SUCCESS",
    {
      scope: "@youtube-pickup"
    }
  ),
  saveLastSeenVideoId: createBridge<{ lastSeenVideoId: string }>(
    "SAVE_LAST_SEEN_VIDEO_ID",
    {
      scope: "@youtube-pickup"
    }
  )
};

/**
 * const ytBridge = {
 *  fetchLastSeenVideoId: createBridge("FETCH_LAST_SEEN_VIDEO_ID_SUCCESS", {
 *    scope: "@youtube-pickup/content"
 *  })
 * }
 *
 * // Usage
 * ytBridge.fetchLastSeenVideoId.observable().subscribe((payload) => {
 *  console.log(`lastSeenVideoId is ${payload.lastSeenVideoId}`)
 * })
 *
 * ytBridge.fetchLastSeenVideoId.post({
 *  lastSeenVideoId: "xxxxx"
 * })
 *
 */
