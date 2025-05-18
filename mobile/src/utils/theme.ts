export const theme = {
  greyDarker: "#292929",
  grey: "#393939",
  greyLight: "#6B6B6B",
  redDark: "#6A1B15",
  red: "#D5232A",
  redLight: "#DF4237",
  redLighter: "#E66762",
  redLightest: "#ED9791",
  redPale: "#FAE3E3",
  redPaler: "#FDF2F2",
  redPalest: "#FEFBFB",
  white: "#FFFFFF",
  font: {},
};

export const stackScreenOptions = {
  headerStyle: {
    backgroundColor: "#393939",
  },
  headerTintColor: "rgba(235, 235, 235, 1)",
  headerTitleStyle: {
    fontWeight: "400",
  },
  contentStyle: {
    backgroundColor: "#393939",
    paddingBottom: 96, // to match the bottom navigation height
  },
} as const;
