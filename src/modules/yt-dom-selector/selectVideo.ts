import * as select from "select-dom";

export const selectVideo = (videoId: string): HTMLAnchorElement => {
  return select(`a[href*=${videoId}][id=thumbnail]`);
};
