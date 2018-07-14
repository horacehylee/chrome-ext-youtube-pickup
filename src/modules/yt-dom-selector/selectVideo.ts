import * as select from "select-dom";

const hasNumberAsFirstCharPattern = new RegExp('^[0-9]')

export const selectVideo = (videoId: string): HTMLAnchorElement => {
  let _videoId = videoId;
  if (hasNumberAsFirstCharPattern.test(_videoId)) {
    _videoId = _videoId.substring(1);
  }
  return select(`a[href*=${_videoId}][id=thumbnail]`);
};
