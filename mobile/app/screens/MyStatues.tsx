import { FC } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { BackToMapButton } from "../components/BackToMapButton";

type MyStatuesProps = {
  onClose: () => void;
};

export const MyStatues: FC<MyStatuesProps> = ({ onClose }) => {
  return (
    <SafeAreaView>
      <BackToMapButton onClose={onClose} />
    </SafeAreaView>
  );
};
