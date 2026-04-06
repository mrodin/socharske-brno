import { useState, useEffect } from "react";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

type UseImageBase64Result = {
  imageBase64: string | null;
  isImageLoading: boolean;
  imageLoadError: boolean;
};

export const useImageBase64 = (imageUrl?: string): UseImageBase64Result => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);

  useEffect(() => {
    if (!imageUrl) return;

    let cancelled = false;
    setIsImageLoading(true);
    setImageLoadError(false);
    setImageBase64(null);

    // Use expo-image-manipulator to download and convert to base64.
    // The old approach (fetch → blob → FileReader.readAsDataURL) is broken in RN 0.83.
    manipulateAsync(imageUrl, [], {
      base64: true,
      format: SaveFormat.JPEG,
      compress: 0.8,
    })
      .then((result) => {
        if (!cancelled && result.base64) {
          setImageBase64(`data:image/jpeg;base64,${result.base64}`);
        }
      })
      .catch((error) => {
        console.error("Error converting image to base64:", error);
        if (!cancelled) setImageLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setIsImageLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return { imageBase64, isImageLoading, imageLoadError };
};
