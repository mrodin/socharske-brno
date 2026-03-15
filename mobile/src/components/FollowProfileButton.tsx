import { HearthFilledIcon } from "@/icons/HearthFilledIcon";
import { HearthOutlineIcon } from "@/icons/HearthOutlineIcon";
import { cn } from "@/utils/cn";
import { TouchableOpacity, Text } from "react-native";

export const FollowProfileButton: React.FC<{
  className?: string;
  isFollowing: boolean;
  onPress: () => void;
}> = ({ className, isFollowing, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn("px-2 py-2 rounded-full bg-gray-darker", className)}
    >
      {isFollowing ? <HearthFilledIcon /> : <HearthOutlineIcon />}
    </TouchableOpacity>
  );
};
