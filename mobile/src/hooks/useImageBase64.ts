import { useState, useEffect } from "react";

type UseImageBase64Result = {
  imageBase64: string | null;
  isImageLoading: boolean;
  imageLoadError: boolean;
};

export const useImageBase64 = (imageUrl?: string): UseImageBase64Result => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);

  // Function to download image and convert to base64
  const downloadAndConvertImage = async (url: string) => {
    try {
      setIsImageLoading(true);
      setImageLoadError(false);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      // Convert blob to base64
      const base64Promise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const base64 = await base64Promise;
      setImageBase64(base64);
    } catch (error) {
      console.error("Error downloading image:", error);
      setImageLoadError(true);
    } finally {
      setIsImageLoading(false);
    }
  };

  // Download image on component mount or when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      downloadAndConvertImage(imageUrl);
    }
  }, [imageUrl]);

  return {
    imageBase64,
    isImageLoading,
    imageLoadError,
  };
};
