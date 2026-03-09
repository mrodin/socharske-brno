import { useState, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

/**
 * Pre-crops an image into 9 puzzle pieces (3x3 grid).
 * Each piece is a local file URI that can be rendered instantly.
 */
export const usePuzzlePieces = (imageUrl?: string) => {
  const { width: screenWidth } = useWindowDimensions();
  // Map from piece index (0-8) to local cropped image URI
  const [pieceUris, setPieceUris] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;

    let cancelled = false;
    setIsLoading(true);
    setError(false);
    setPieceUris({});

    const cropPieces = async () => {
      try {
        // First, get the actual image dimensions by loading it
        const fullImage = await manipulateAsync(imageUrl, [], {
          format: SaveFormat.JPEG,
        });

        const imgWidth = fullImage.width;
        const imgHeight = fullImage.height;
        const cropSize = Math.min(imgWidth, imgHeight) / 3;

        const uris: Record<number, string> = {};

        // Crop 9 pieces in parallel
        const promises = Array.from({ length: 9 }, async (_, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;

          const result = await manipulateAsync(
            imageUrl,
            [
              {
                crop: {
                  originX: col * cropSize,
                  originY: row * cropSize,
                  width: cropSize,
                  height: cropSize,
                },
              },
            ],
            { format: SaveFormat.JPEG, compress: 0.85 }
          );

          uris[i] = result.uri;
        });

        await Promise.all(promises);

        if (!cancelled) {
          setPieceUris(uris);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to crop puzzle pieces:", err);
        if (!cancelled) {
          setError(true);
          setIsLoading(false);
        }
      }
    };

    cropPieces();

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return { pieceUris, isLoading, error };
};
