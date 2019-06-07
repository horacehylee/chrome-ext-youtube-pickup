import * as dotProp from "dot-prop";

export interface YtVideo {
  videoId: string;
  title: string;
  isLive: boolean;
}

export const queryVideos = (ytInitialData): YtVideo[] => {
  const contents = dotProp.get(
    ytInitialData,
    "contents.twoColumnBrowseResultsRenderer.tabs.0.tabRenderer.content.sectionListRenderer.contents",
    []
  );
  return contents.map(parseContent).filter(v => !v.isLive);
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
  const isLive = dotProp.get(
    ytVideoContent,
    "itemSectionRenderer.contents.0.shelfRenderer.title.simpleText",
    null
  ) === 'Live';

  return {
    videoId,
    title,
    isLive
  };
};
