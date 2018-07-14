import { getLastSeenVideoId } from "./getLastSeenVideoId";
import { saveLastSeenVideoId } from "./saveLastSeenVideoId";
import { clearLastSeenVideoId } from "./clearLastSeenVideoId";

export const ytRepository = {
  getLastSeenVideoId: getLastSeenVideoId,
  saveLastSeenVideoId: saveLastSeenVideoId,
  clearLastSeenVideoId: clearLastSeenVideoId
};
