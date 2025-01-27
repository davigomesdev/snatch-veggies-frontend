export const changeCursor = (iconUrl: string, element = document.body): void => {
  element.style.cursor = iconUrl ? `url(${iconUrl}), auto` : 'auto';
};
