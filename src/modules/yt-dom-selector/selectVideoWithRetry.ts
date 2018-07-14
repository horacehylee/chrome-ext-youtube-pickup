import { YtVideo } from "../yt-selector/queryVideos";
import { selectVideo } from "./selectVideo";
import { of, defer, throwError } from "rxjs";
import { map, retryWhen, delay, take, concat } from "rxjs/operators";

export class VideoNotFoundError extends Error {
  constructor(message: string, public video: YtVideo) {
    super(message);
  }
}

export interface SelectVideoRetryOptions {
  delayMs: number;
  times: number;
}

export const selectVideoWithRetry = (
  video: YtVideo,
  options: SelectVideoRetryOptions = {
    delayMs: 500,
    times: 10
  }
) => {
  return defer(() => of(selectVideo(video.videoId))).pipe(
    map(videoElement => {
      if (!videoElement) {
        throw videoElement;
      }
      return videoElement;
    }),
    retryWhen(errors =>
      errors.pipe(
        delay(options.delayMs),
        take(options.times - 1),
        concat(
          throwError(new VideoNotFoundError(`Video cannot be found`, video))
        )
      )
    )
  );
};
