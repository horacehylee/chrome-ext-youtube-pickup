import * as dotProp from "dot-prop";

export interface YtVideo {
  videoId: string;
  title: string;
}

export const queryVideos = (ytInitialData): YtVideo[] => {
  const contents = dotProp.get(
    ytInitialData,
    "contents.twoColumnBrowseResultsRenderer.tabs.0.tabRenderer.content.sectionListRenderer.contents",
    []
  );
  return contents.map(parseContent);
};

export const parseContent = (ytVideoContent): YtVideo => {
  const videoId = dotProp.get(
    ytVideoContent,
    "itemSectionRenderer.contents.0.shelfRenderer.content.expandedShelfContentsRenderer.items.0.videoRenderer.videoId",
    null
  );
  const title = dotProp.get(
    ytVideoContent,
    "itemSectionRenderer.contents.0.shelfRenderer.content.expandedShelfContentsRenderer.items.0.videoRenderer.title.simpleText",
    null
  );
  return {
    videoId,
    title
  };
};
