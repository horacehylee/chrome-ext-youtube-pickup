import { readFile } from "fs";
import { promisify } from "bluebird";
import { selectVideo } from "./selectVideo";
const readFileAsync = promisify(readFile);

describe("selectVideo", () => {
  it("should select videoId element", async () => {
    const buffer = await readFileAsync(
      __dirname + "/../../../sample/youtube.html"
    );
    document.body.innerHTML = buffer.toString();
    const element = selectVideo("sLgKXX0FrJo");

    expect(element).toBeDefined();
    expect(element).toBeInstanceOf(HTMLAnchorElement);
    expect(element).toMatchSnapshot();
  });
});
