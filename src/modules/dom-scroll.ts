const scrollToElement = (element: HTMLElement) => {
  element.scrollIntoView({
    block: "center"
  });
};

export const domScroll = {
  scrollToElement: scrollToElement
};
