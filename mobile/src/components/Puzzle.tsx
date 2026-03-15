import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';
import { DraggableGrid,  } from 'react-native-draggable-grid';

interface PuzzleProps {
  imageUrl?: string;
}

export const Puzzle: React.FC<PuzzleProps> = ({ 
  imageUrl = "https://gis.brno.cz/ost/filebox/ug_file.php?FILE_ID=67394&RECORD_ID=6935&AGENDA_IDENT=PASPORT_ODA_OBJEKTY&preview=1080"
}) => {
  // Create initial puzzle data with 9 pieces
  const initialPuzzleData = Array.from({ length: 9 }, (_, i) => ({
    key: i.toString(),
    disabledDrag: false,
    disabledReSorted: false
  })).sort(() => Math.random() - 0.5); // Randomize initial order
  
  
  // Initialize with shuffled pieces
  const [data, setData] = useState(initialPuzzleData);
  
  // Pre-load image source outside of render function to avoid multiple downloads
  const imageSource = { uri: imageUrl };

  const renderItem = (item: {name?: string, key: string, disabledDrag?: boolean}) => {
    // Parse the item name as number (1-9) to determine position
    const index = parseInt(item.key);
    // Calculate the row and column for a 3x3 grid
    const row = Math.floor(index / 3);
    const col = index % 3;
    
    // The full image is treated as a 3x3 grid, showing only the correct portion
    return (
      <View
        className="w-[100px] h-[100px] justify-center items-center overflow-hidden"
        key={item.key}
      >
        <View style={{ borderWidth: 1, borderStyle: "solid", borderColor: item.disabledDrag ? "green" : "red"}} className="w-[100px] h-[100px] overflow-hidden relative">
          <Image
            source={imageSource}
            style={{
              opacity: item.disabledDrag ? 1 : 0.7,
              width: 300, // Full image width (3x cell width)
              height: 300, // Full image height (3x cell height)
              position: 'absolute',
              top: -row * 100, // Offset based on row position
              left: -col * 100, // Offset based on column position
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center">
      <View className="w-[300px] h-[300px] justify-center ">
        <DraggableGrid
          numColumns={3}
          renderItem={renderItem}
          data={data}
          
          onDragRelease={(newData) => {
            // Check if the new data is in the correct order
            const isCorrectOrder = newData.every((item, index) => item.key === index.toString());
            if (isCorrectOrder) {
              alert('Congratulations! You solved the puzzle!');
            }
            setData(newData.map((item, index) => ({...item, disabledDrag:item.key === index.toString(), disabledReSorted: item.key === index.toString()}))); // Update data state after drag release
          }}
        />
      </View>
    </View>
  );
}


// StyleSheet has been removed and replaced with tailwind classes