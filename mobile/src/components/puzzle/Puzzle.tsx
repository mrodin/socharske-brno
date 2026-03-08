import React, { useCallback, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import ReanimatedAnimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { usePuzzleData } from "../../hooks/usePuzzleData";
import { usePuzzlePieces } from "../../hooks/usePuzzlePieces";
import { PuzzleGrid } from "./PuzzleGrid";
import { notify } from "@/components/Notification";

type PuzzleProps = {
  imageUrl: string;
  onComplete: () => void;
  onClose: () => void;
};

export const Puzzle: React.FC<PuzzleProps> = ({
  imageUrl,
  onComplete,
  onClose,
}) => {
  const { width: puzzleSize } = useWindowDimensions();

  // Reanimated shared values for progress bars (runs on UI thread, works on Fabric)
  const progressWidth = useSharedValue(0);
  const closingWidth = useSharedValue(0);

  // Pre-crop the image into 9 local-file pieces BEFORE mounting Sortable.Grid.
  const { pieceUris, isLoading, error: imageError } = usePuzzlePieces(imageUrl);
  const piecesReady =
    !isLoading && !imageError && Object.keys(pieceUris).length === 9;

  const handleComplete = useCallback(() => {
    onComplete();
    closingWidth.value = withTiming(
      puzzleSize,
      { duration: 4000, easing: Easing.linear },
      (finished) => {
        if (finished) {
          runOnJS(notify)("Dobrá práce!\nSocha je ve tvé sbírce. 🤟");
          runOnJS(onClose)();
        }
      }
    );
  }, [onComplete, onClose, puzzleSize]);

  const { data, correctPieces, progress, updatePuzzleData, reset } =
    usePuzzleData(handleComplete);

  useEffect(() => {
    reset();
    progressWidth.value = 0;
    closingWidth.value = 0;
  }, [imageUrl]);

  useEffect(() => {
    progressWidth.value = withTiming(progress * puzzleSize, { duration: 500 });
  }, [progress, puzzleSize]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
  }));

  const closingBarStyle = useAnimatedStyle(() => ({
    width: closingWidth.value,
  }));

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#393939",
      }}
    >
      {piecesReady ? (
        <>
          <View
            style={{
              width: puzzleSize,
              height: puzzleSize,
              justifyContent: "center",
            }}
          >
            <PuzzleGrid
              data={data}
              updatePuzzleData={updatePuzzleData}
              pieceUris={pieceUris}
              progress={progress}
            />
          </View>
          <View style={{ width: puzzleSize, marginTop: -1 }}>
            <View style={{ height: 4, overflow: "hidden" }}>
              <ReanimatedAnimated.View
                style={[
                  {
                    height: "100%",
                    backgroundColor: "#D5232A",
                    position: "absolute",
                  },
                  progressBarStyle,
                ]}
              />
              <ReanimatedAnimated.View
                style={[
                  {
                    height: "100%",
                    backgroundColor: "#fff",
                    position: "absolute",
                  },
                  closingBarStyle,
                ]}
              />
            </View>
            <Text
              style={{
                textAlign: "center",
                marginTop: 4,
                fontSize: 18,
                color: "#fff",
                fontWeight: "500",
              }}
            >
              {progress === 1 ? "Máš hotovo!" : `${correctPieces}/9`}
            </Text>
          </View>
        </>
      ) : (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {imageError ? (
            <Text style={{ color: "#dc2626", textAlign: "center" }}>
              Nepovedlo se načíst obrázek puzzle.{"\n"}
              Zkontrolujte své internetové připojení.
            </Text>
          ) : (
            <ActivityIndicator size="large" color="#D5232A" />
          )}
        </View>
      )}
    </View>
  );
};
