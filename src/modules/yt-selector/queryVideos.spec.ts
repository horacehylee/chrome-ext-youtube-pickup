import { parseContent, YtVideo, queryVideos } from "./queryVideos";

describe("queryVideos", () => {
  it("should parse ytVideoContent", () => {
    const ytVideoContent = require("./../../../sample/ytVideoContent.json");
    const ytVideo = parseContent(ytVideoContent);
    const expectedYtVideo: YtVideo = {
      title:
        "World of Warcraft: Mastering the Menagerie - SQUIRT: DEEBS, TYRI, PUZZLE - WoW Battle Pet Strategy",
      videoId: "xqnOn8sf7K0"
    };
    expect(ytVideo).toEqual(expectedYtVideo);
  });

  it("should parse ytInitData", () => {
    const ytInitData = require("./../../../sample/ytInitialData.json");
    const ytVideos = queryVideos(ytInitData);
    const expectedYtVideos: YtVideo[] = [
      {
        title:
          "World of Warcraft: Mastering the Menagerie - SQUIRT: DEEBS, TYRI, PUZZLE - WoW Battle Pet Strategy",
        videoId: "xqnOn8sf7K0"
      },
      {
        videoId: "sLgKXX0FrJo",
        title: "Adding a Listing Database Table - Part 29"
      }
      //...
    ];
    expect(ytVideos.length).toBeGreaterThan(0);
    expectedYtVideos.forEach((expectedYtVideo, i) => {
      expect(ytVideos[i]).toEqual(expectedYtVideo);
    });
  });
});
