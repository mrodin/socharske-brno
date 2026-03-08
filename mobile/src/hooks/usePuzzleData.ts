import { useState } from "react";

export type PuzzlePiece = {
  key: string;
  disabledDrag: boolean;
  disabledReSorted: boolean;
};
type UsePuzzleDataResult = {
  data: PuzzlePiece[];
  setData: React.Dispatch<React.SetStateAction<PuzzlePiece[]>>;
  correctPieces: number;
  progress: number;
  updatePuzzleData: (newData: PuzzlePiece[]) => void;
  reset: () => void;
};

// Create initial puzzle data with 9 pieces
const getInitialRandomizedData = (): PuzzlePiece[] => {
  let attempts = 0;
  const maxAttempts = 50;
  while (true) {
    attempts++;
    const data = Array.from({ length: 9 }, (_, i) => ({
      key: i.toString(),
      disabledDrag: false,
      disabledReSorted: false,
    })).sort(() => Math.random() - 0.5); /* Randomize initial order*/
    const notCorrect = data.some(
      (item, index) => item.key === index.toString()
    );
    if (!notCorrect || attempts > maxAttempts) {
      return data;
    }
  }
};

export const usePuzzleData = (onComplete: () => void): UsePuzzleDataResult => {
  // Initialize with shuffled pieces
  const [data, setData] = useState<PuzzlePiece[]>(getInitialRandomizedData());

  // Calculate progress - how many pieces are in correct positions
  const correctPieces = data.filter(
    (item, index) => item.key === index.toString()
  ).length;
  const progress = correctPieces / 9; // Progress as a decimal (0 to 1)

  // Function to update puzzle data with drag completion logic
  const updatePuzzleData = (newData: PuzzlePiece[]) => {
    // Check if the new data is in the correct order
    const isCorrectOrder = newData.every(
      (item, index) => item.key === index.toString()
    );
    if (isCorrectOrder) {
      onComplete();
    }

    setData(
      newData.map((item, index) => ({
        ...item,
        disabledDrag: item.key === index.toString(),
        disabledReSorted: item.key === index.toString(),
      }))
    );
  };

  const reset = () => {
    setData(getInitialRandomizedData());
  };

  return {
    data,
    setData,
    correctPieces,
    progress,
    updatePuzzleData,
    reset,
  };
};
