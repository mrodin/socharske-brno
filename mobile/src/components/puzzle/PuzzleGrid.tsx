import React from "react";
import { View, ActivityIndicator, useWindowDimensions } from "react-native";
import { FilterImage } from "react-native-svg/filter-image";
import { DraggableGrid } from "react-native-draggable-grid";
import { PuzzlePiece } from "../../hooks/usePuzzleData";
import { CheckIconOutline } from "./CheckIconOutline";

interface PuzzleProps {
  imageBase64: string;
  data: PuzzlePiece[];
  progress: number;
  updatePuzzleData: (newData: PuzzlePiece[]) => void;
}

const NUM_COLUMNS = 3;

export const PuzzleGrid: React.FC<PuzzleProps> = ({
  imageBase64,
  data,
  progress,
  updatePuzzleData,
}) => {
  // Get screen dimensions
  const { width: screenWidth } = useWindowDimensions();

  // Calculate puzzle size based on screen width (with some padding)
  const puzzleSize = screenWidth; // 40px total padding or 90% of screen width
  const pieceSize = puzzleSize / 3; // Each piece is 1/3 of the total puzzle size

  const renderItem = (item: {
    name?: string;
    key: string;
    disabledDrag?: boolean;
  }) => {
    // Don't render items if image is still loading or failed to load
    if (!imageBase64) {
      return (
        <View
          className="justify-center items-center"
          style={{
            width: pieceSize,
            height: pieceSize,
          }}
          key={item.key}
        >
          <ActivityIndicator size="small" color="#999" />
        </View>
      );
    }

    const hasCorrectPosition = item.disabledDrag;

    // Parse the item name as number (1-9) to determine position
    const index = parseInt(item.key);
    // Calculate the row and column for a 3x3 grid
    const row = Math.floor(index / 3);
    const col = index % 3;

    // The full image is treated as a 3x3 grid, showing only the correct portion
    return (
      <View
        className="relative marker:justify-center items-center overflow-hidden"
        style={{
          width: pieceSize,
          height: pieceSize,
        }}
        key={item.key}
      >
        <View
          className="overflow-hidden relative"
          style={{
            width: pieceSize,
            height: pieceSize,
          }}
        >
          <FilterImage
            source={{ uri: imageBase64 }}
            className="absolute"
            style={{
              filter: hasCorrectPosition ? "grayscale(0%)" : "grayscale(90%)", // for some reason setting filter to none crash the app
              width: puzzleSize,
              height: puzzleSize,
              top: -row * pieceSize, // Offset based on row position, cutting  the image
              left: -col * pieceSize, // Offset based on column position, cutting the image
            }}
          />
        </View>
        {hasCorrectPosition && progress < 1 && <CheckIconOutline />}
      </View>
    );
  };

  return (
    <DraggableGrid
      numColumns={NUM_COLUMNS}
      renderItem={renderItem}
      data={data}
      delayLongPress={75}
      onDragRelease={(newData) => {
        updatePuzzleData(newData);
      }}
    />
  );
};
