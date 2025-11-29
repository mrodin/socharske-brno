type ThumbnailSize = 96 | 480;

export const getThumbnailUrl = (statueId: number, size: ThumbnailSize) => {
  return `${process.env.EXPO_PUBLIC_IMAGES_STORAGE_URL}/${statueId}/thumb${size}/1.JPEG`;
};

export const defaultUserIconSource = require("../../assets/images/spravedlnost.png");
