import React from "react";
import { View, useWindowDimensions } from "react-native";
import { FilterImage } from "react-native-svg/filter-image";
import Sortable, {
  useCommonValuesContext,
  DragActivationState,
} from "react-native-sortables";
import { useSharedValue, useAnimatedReaction } from "react-native-reanimated";
import { PuzzlePiece } from "../../hooks/usePuzzleData";
import { CheckIconOutline } from "@/icons/CheckIconOutline";

interface PuzzleProps {
  pieceUris: Record<number, string>;
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

    if (baseKeys.length === 0) return;

    const activeKey = activeItemKey.value;
    if (!activeKey) return;

    const originIndex = baseKeys.indexOf(activeKey);
    if (originIndex === -1) return;

    if (targetIndex === originIndex) {
      return baseKeys;
    }

    const targetKey = baseKeys[targetIndex];

    if (targetKey === targetIndex.toString()) return;
    if (activeKey === originIndex.toString()) return;

    const newKeys = [...baseKeys];
    newKeys[originIndex] = targetKey;
    newKeys[targetIndex] = activeKey;

    return newKeys;
  };
};

export const PuzzleGrid: React.FC<PuzzleProps> = ({
  pieceUris,
  data,
  progress,
  updatePuzzleData,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const pieceSize = screenWidth / NUM_COLUMNS;

  const renderItem = ({ item }: { item: PuzzlePiece }) => {
    const hasCorrectPosition = item.disabledDrag;
    const pieceIndex = parseInt(item.key);
    const uri = pieceUris[pieceIndex];

    return (
      <View
        style={{
          width: pieceSize,
          height: pieceSize,
        }}
        // Prevent Fabric from collapsing this view in the native hierarchy
        collapsable={false}
        // Force off-screen compositing – different rendering path that may
        // avoid the Animated.View compositing bug
        needsOffscreenAlphaCompositing
        renderToHardwareTextureAndroid
        key={item.key}
      >
        <FilterImage
          source={{ uri }}
          style={{
            width: pieceSize,
            height: pieceSize,
            filter: hasCorrectPosition ? "grayscale(0%)" : "grayscale(90%)",
          }}
        />
        {hasCorrectPosition && progress < 1 && (
          <View
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              backgroundColor: "#22c55e",
              borderRadius: 12,
              width: 24,
              height: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckIconOutline />
          </View>
        )}
      </View>
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
      strategy={usePuzzleStrategy}
      itemEntering={null}
      itemExiting={null}
    />
  );
};
