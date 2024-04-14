import { FC, ReactNode } from "react";
import { Text, StyleSheet } from "react-native";
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
