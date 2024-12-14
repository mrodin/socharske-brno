import { FC, ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Text } from "./Text";

import { theme } from "../utils/theme";

type TitleProps = {
  children: ReactNode;
};

export const Title: FC<TitleProps> = ({ children }) => (
  <Text style={styles.title}>{children}</Text>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.grey,
  },
});
