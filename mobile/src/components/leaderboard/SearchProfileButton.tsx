import { SearchIcon } from "@/icons/SearchIcon";
import { cn } from "@/utils/cn";
import { TouchableOpacity, Text } from "react-native";

export const SearchProfileButton: React.FC<{
  className?: string;
  onPress: () => void;
}> = ({ className, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        "flex items-center justify-center px-1 pt-2 rounded-full bg-gray-darker",
        className
      )}
    >
      <SearchIcon color="white" />
    </TouchableOpacity>
  );
};
