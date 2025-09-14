import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  useWindowDimensions,
  Animated,
  Easing,
} from "react-native";
import { useImageBase64 } from "../../hooks/useImageBase64";
import { usePuzzleData } from "../../hooks/usePuzzleData";
import { PuzzleGrid } from "./PuzzleGrid";

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
  // Animated width for progress bar
  const animatedProgressBarComplete = useRef(new Animated.Value(0)).current;
  const animatedProgressBarClosing = useRef(new Animated.Value(0)).current;
  // Animated opacity for puzzle grid
  const animatedPuzzleOpacity = useRef(new Animated.Value(0)).current;
  // Get screen dimensions
  const { width: puzzleSize } = useWindowDimensions();

  const handleComplete = () => {
    onComplete();
    // Animate the closing of the progress bar
    Animated.timing(animatedProgressBarClosing, {
      toValue: 100,
      duration: 4000,
      useNativeDriver: false,
    }).start(() => {
      onClose();
    });
  };

  // Use custom hooks
  const { imageBase64, isImageLoading, imageLoadError } =
    useImageBase64(imageUrl);
  const { data, correctPieces, progress, updatePuzzleData, reset } =
    usePuzzleData(handleComplete);

  const puzzleIsReady = !isImageLoading && !imageLoadError && imageBase64;

  useEffect(() => {
    reset();
  }, [imageUrl]);

  // Animate progress bar width when progress changes
  useEffect(() => {
    Animated.timing(animatedProgressBarComplete, {
      toValue: progress * 100,
      duration: 500,
      useNativeDriver: false, // Width animations require setting this to false
    }).start();
  }, [progress]);

  // Animate puzzle opacity when puzzle is ready
  useEffect(() => {
    if (puzzleIsReady) {
      Animated.timing(animatedPuzzleOpacity, {
        toValue: 1,
        duration: 1000,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      animatedPuzzleOpacity.setValue(0);
    }
  }, [puzzleIsReady]);

  return (
    <View className="flex-1 items-center justify-center bg-gray">
      {puzzleIsReady ? (
        <>
          {/** Puzzle grid and progress bar */}
          <Animated.View
            className="justify-center"
            style={{
              width: puzzleSize,
              height: puzzleSize,
              opacity: animatedPuzzleOpacity,
            }}
          >
            <PuzzleGrid
              data={data}
              updatePuzzleData={updatePuzzleData}
              imageBase64={imageBase64}
            />
          </Animated.View>
          <View style={{ width: puzzleSize }} className="-mt-1">
            <View className="h-1 overflow-hidden ">
              <Animated.View
                className="h-full bg-red"
                style={{
                  width: animatedProgressBarComplete.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                }}
              />
              <Animated.View
                className="h-full bg-white -mt-1"
                style={{
                  width: animatedProgressBarClosing.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                }}
              />
            </View>
            <Text className="text-center mt-1 text-lg text-white font-medium">
              {progress === 1 ? "Máš hotovo!" : `${correctPieces}/9`}
            </Text>
          </View>
        </>
      ) : (
        <View className="justify-center items-center">
          {imageLoadError ? (
            <Text className="text-red-600 text-center">
              Nepovedlo sena načíst obrázek puzzle.{"\n"}
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
