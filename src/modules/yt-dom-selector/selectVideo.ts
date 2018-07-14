import * as select from "select-dom";

export const selectVideo = (videoId: string): HTMLAnchorElement => {
  let _videoId = videoId;
  if (/^[0-9]/.test(_videoId)) {
    _videoId = _videoId.substring(1);
  }
  return select(`a[href*=${_videoId}][id=thumbnail]`);
};
