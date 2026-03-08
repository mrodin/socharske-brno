import { Close } from "@/icons/Close";
import { View, Text, TouchableOpacity } from "react-native";
import { toast } from "sonner-native";

export const notify = (message: string) => {
  const toastId = toast.custom(
    <NotificationMessage
      message={message}
      onClose={() => toast.dismiss(toastId)}
    />
  );
};

type NotificationMessageProps = {
  message: string;
  onClose: () => void;
};

const NotificationMessage: React.FC<NotificationMessageProps> = ({
  message,
  onClose,
}) => (
  <View className="bg-[rgba(0,0,0,0.8)] rounded-lg mx-10">
    <Text className="text-white w-full text-center p-2">{message}</Text>
    <TouchableOpacity onPress={onClose} className="absolute right-4 top-3">
      <View>
        <Close color="white" width={10} height={10} />
      </View>
    </TouchableOpacity>
  </View>
);
