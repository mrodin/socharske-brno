import { FC } from "react";
import { View, Text, StyleSheet } from "react-native";

const Settings: FC = () => {
  return (
    <View style={styles.container}>
      <Text>Tab [Settings]</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Settings;
