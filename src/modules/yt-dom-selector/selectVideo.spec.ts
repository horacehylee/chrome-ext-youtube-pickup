import { readFile } from "fs";
import { promisify } from "bluebird";
import { selectVideo } from "./selectVideo";
const readFileAsync = promisify(readFile);

interface SelectVideoTestOption {
  description: string;
  sampleFileName: string;
  videoId: string;
}

const buildTests = (options: SelectVideoTestOption[]) => {
  return options.map(({ description, sampleFileName, videoId }) => {
    it(description, async () => {
      const buffer = await readFileAsync(
        `${__dirname}/../../../sample/${sampleFileName}`
      );
      document.body.innerHTML = buffer.toString();
      const element = selectVideo(videoId);

      expect(element).toBeDefined();
      expect(element).toBeInstanceOf(HTMLAnchorElement);
      expect(element).toMatchSnapshot();
    });
  });
};

describe("selectVideo", () => {
  buildTests([
    {
      description: "should select videoId element",
      sampleFileName: "ytVideoElement.html",
      videoId: "sLgKXX0FrJo"
    },
    {
      description: "should select video element with time value in url",
      sampleFileName: "ytVideoElement_withTime.html",
      videoId: "xu6KLURIuh8"
    },
    {
      description:
        "should select video element with number as the first character",
      sampleFileName: "ytVideoElement_numberAsFirstChar.html",
      videoId: "2LifjpxpIwU"
    }
  ]);
});
