import { saveLastSeenVideoId } from "./saveLastSeenVideoId";

export const clearLastSeenVideoId = (): Promise<void> => {
  return saveLastSeenVideoId(null);
};
