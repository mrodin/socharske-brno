import { ArrowRight } from "@/icons/ArrowRight";
import { cn } from "@/utils/cn";
import { TouchableOpacity, View, Text } from "react-native";

const List = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <View className={cn("gap-4", className)}>{children}</View>;
};

const Item = ({
  children,
  onPress,
  textClassName,
}: {
  children: React.ReactNode;
  onPress: () => void;
  textClassName?: string;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={typeof children === "string" ? children : undefined}
    >
      <View className="flex-row justify-between py-3">
        <Text className={cn("text-white", textClassName)}>{children}</Text>
        <ArrowRight className="ml-1" color="white" width={8} height={12} />
      </View>
    </TouchableOpacity>
  );
};

export default {
  Item,
  List,
};
