import React from "react";
import { View, ActivityIndicator, useWindowDimensions } from "react-native";
import { FilterImage } from "react-native-svg/filter-image";
import Sortable, {
  useCommonValuesContext,
  DragActivationState,
} from "react-native-sortables";
import { useSharedValue, useAnimatedReaction } from "react-native-reanimated";
import { PuzzlePiece } from "../../hooks/usePuzzleData";
import { CheckIconOutline } from "./CheckIconOutline";

interface PuzzleProps {
  imageBase64: string;
  data: PuzzlePiece[];
  progress: number;
  updatePuzzleData: (newData: PuzzlePiece[]) => void;
}

const NUM_COLUMNS = 3;

const usePuzzleStrategy = () => {
  const {
    indexToKey,
    containerWidth,
    touchPosition,
    activationState,
    activeItemKey,
  } = useCommonValuesContext();
  const baseOrderSnapshot = useSharedValue<string[]>([]);

  useAnimatedReaction(
    () => activationState.value,
    (state, prev) => {
      // Snapshot base order when drag starts
      if (
        state === DragActivationState.TOUCHED &&
        prev !== DragActivationState.TOUCHED
      ) {
        baseOrderSnapshot.value = indexToKey.value;
      }
    }
  );

  return ({
    activeIndex,
    position,
    dimensions,
  }: {
    activeIndex: number;
    position: { x: number; y: number };
    dimensions: { width: number; height: number };
  }) => {
    "worklet";
    const width = containerWidth.value;
    if (!width) return;

    const pieceSize = width / NUM_COLUMNS;

    // Use touch position if available, otherwise fallback to item center
    let x, y;
    if (touchPosition.value) {
      x = touchPosition.value.x;
      y = touchPosition.value.y;
    } else {
      x = position.x + dimensions.width / 2;
      y = position.y + dimensions.height / 2;
    }

    const col = Math.floor(x / pieceSize);
    const row = Math.floor(y / pieceSize);

    if (col < 0 || col >= NUM_COLUMNS || row < 0 || row >= NUM_COLUMNS) return;

    const targetIndex = row * NUM_COLUMNS + col;
    const baseKeys = baseOrderSnapshot.value;

    // Safety check
    if (baseKeys.length === 0) return;

    const activeKey = activeItemKey.value;
    if (!activeKey) return;

    // Find where the active item was originally
    const originIndex = baseKeys.indexOf(activeKey);
    if (originIndex === -1) return;

    if (targetIndex === originIndex) {
      // If we are back at origin, restore base order
      return baseKeys;
    }

    const targetKey = baseKeys[targetIndex];

    // Check if the target item was fixed at the start of the drag
    // In this puzzle, item key corresponds to its correct index (0-8)
    if (targetKey === targetIndex.toString()) return;

    // Also check if the active item was fixed at start (safety check)
    if (activeKey === originIndex.toString()) return;

    const newKeys = [...baseKeys];
    // Swap origin and target in the base array
    newKeys[originIndex] = targetKey;
    newKeys[targetIndex] = activeKey;

    return newKeys;
  };
};

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

  const renderItem = ({ item }: { item: PuzzlePiece }) => {
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
      <Sortable.Handle mode={item.disabledDrag ? "non-draggable" : "draggable"}>
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
      </Sortable.Handle>
    );
  };

  return (
    <Sortable.Grid
      data={data}
      columns={NUM_COLUMNS}
      renderItem={renderItem}
      onDragEnd={({ indexToKey }) => {
        const newData = indexToKey
          .map((key) => data.find((item) => item.key === key))
          .filter((item): item is PuzzlePiece => item !== undefined);
        updatePuzzleData(newData);
      }}
      rowGap={0}
      columnGap={0}
      dragActivationDelay={0}
      customHandle
      strategy={usePuzzleStrategy}
    />
  );
};
