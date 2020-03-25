import { parseContent, YtVideo, queryVideos } from "./queryVideos";

describe("queryVideos", () => {
  it("should parse ytVideoContent", () => {
    const ytVideoContent = require("./../../../sample/ytVideoContent.json");
    const ytVideo = parseContent(ytVideoContent);
    const expectedYtVideo: YtVideo = {
      title:
        "World of Warcraft: Mastering the Menagerie - SQUIRT: DEEBS, TYRI, PUZZLE - WoW Battle Pet Strategy",
      videoId: "xqnOn8sf7K0",
      isLive: false
    };
    expect(ytVideo).toEqual(expectedYtVideo);
  });

  it("should parse ytVideoContent with Live", () => {
    {
      const ytVideoContent = require("./../../../sample/ytVideoContent_live.json");
      const ytVideo = parseContent(ytVideoContent);
      const expectedYtVideo: YtVideo = {
        title: "JSNation Conference 2019 - NodeJS Hall",
        videoId: "-rs-5ZL-f9w",
        isLive: true
      };
      expect(ytVideo).toEqual(expectedYtVideo);
    }
    {
      const ytVideoContent = require("./../../../sample/ytVideoContent_live_2.json");
      const ytVideo = parseContent(ytVideoContent);
      const expectedYtVideo: YtVideo = {
        title: "Good News with Bob Proctor",
        videoId: "tQw43U5k69Y",
        isLive: true
      };
      expect(ytVideo).toEqual(expectedYtVideo);
    }
  });

  it("should parse ytInitData", () => {
    const ytInitData = require("./../../../sample/ytInitialData.json");
    const ytVideos = queryVideos(ytInitData);
    const expectedYtVideos: YtVideo[] = [
      {
        title:
          "World of Warcraft: Mastering the Menagerie - SQUIRT: DEEBS, TYRI, PUZZLE - WoW Battle Pet Strategy",
        videoId: "xqnOn8sf7K0",
        isLive: false
      },
      {
        videoId: "sLgKXX0FrJo",
        title: "Adding a Listing Database Table - Part 29",
        isLive: false
      }
      //...
    ];
    expect(ytVideos.length).toBeGreaterThan(0);
    expectedYtVideos.forEach((expectedYtVideo, i) => {
      expect(ytVideos[i]).toEqual(expectedYtVideo);
    });
  });
});
