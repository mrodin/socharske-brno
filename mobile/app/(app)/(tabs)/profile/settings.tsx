import { View, ScrollView } from "react-native";
import Menu from "@/components/Menu";
import { openAppSettings } from "@/utils/permissions";

const Settings = () => {
  return (
    <ScrollView automaticallyAdjustKeyboardInsets>
      <View className="p-5">
        <Menu.List className="">
          <Menu.Item onPress={openAppSettings}>Určování polohy</Menu.Item>
          <Menu.Item onPress={openAppSettings}>Upozornění</Menu.Item>
        </Menu.List>
      </View>
    </ScrollView>
  );
};

export default Settings;
