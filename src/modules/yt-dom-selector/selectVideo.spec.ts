import { readFile } from "fs";
import { promisify } from "bluebird";
import { selectVideo } from "./selectVideo";
const readFileAsync = promisify(readFile);

describe("selectVideo", () => {
  it("should select videoId element", async () => {
    const buffer = await readFileAsync(
      __dirname + "/../../../sample/ytVideoElement.html"
    );
    document.body.innerHTML = buffer.toString();
    const element = selectVideo("sLgKXX0FrJo");

    expect(element).toBeDefined();
    expect(element).toBeInstanceOf(HTMLAnchorElement);
    expect(element).toMatchSnapshot();
  });

  it('should select video element with time value in url', async() => {
    const buffer = await readFileAsync(
      __dirname + "/../../../sample/ytVideoElement_withTime.html"
    );
    document.body.innerHTML = buffer.toString();
    const element = selectVideo("xu6KLURIuh8");

    expect(element).toBeDefined();
    expect(element).toBeInstanceOf(HTMLAnchorElement);
    expect(element).toMatchSnapshot();
  })
});
