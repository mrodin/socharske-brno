import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../primitives/Text";
import { theme } from "../utils/theme";
import Svg, { Path } from "react-native-svg";
import { calculateDistance } from "../utils/math";

type UndiscoveredStatueProps = {
  lat: number;
  lng: number;
};

export const UndiscoveredStatue: FC<UndiscoveredStatueProps> = ({
  lat,
  lng,
}) => {
  const distance = calculateDistance(49.1759324, 16.5630407, lat, lng).toFixed(
    2
  );

  return (
    <View style={styles.entry}>
      <View style={styles.icon}>
        <Svg width={18} height={27} viewBox="0 0 18 27" fill="none">
          <Path
            d="M5.81818 18.3686V17.946C5.82647 16.496 5.9549 15.3401 6.20348 14.4783C6.46035 13.6166 6.83322 12.9206 7.32209 12.3903C7.81096 11.86 8.39927 11.3794 9.087 10.9485C9.60073 10.6171 10.0606 10.2732 10.4666 9.9169C10.8726 9.56061 11.1958 9.16702 11.4361 8.73615C11.6764 8.29699 11.7965 7.80812 11.7965 7.26953C11.7965 6.6978 11.6598 6.1965 11.3864 5.76562C11.1129 5.33475 10.7442 5.00331 10.2802 4.77131C9.82446 4.5393 9.31901 4.42329 8.76385 4.42329C8.22526 4.42329 7.71567 4.54344 7.23509 4.78374C6.7545 5.01574 6.36091 5.36375 6.05433 5.82777C5.74775 6.2835 5.58203 6.85109 5.55717 7.53054H0.486151C0.52758 5.87334 0.925308 4.50615 1.67933 3.42898C2.43336 2.34351 3.43182 1.53563 4.67472 1.00533C5.91761 0.466737 7.28894 0.197442 8.78871 0.197442C10.4376 0.197442 11.896 0.47088 13.1637 1.01775C14.4315 1.55634 15.4258 2.33937 16.1467 3.36683C16.8675 4.39429 17.228 5.63305 17.228 7.0831C17.228 8.05256 17.0664 8.9143 16.7433 9.66832C16.4284 10.4141 15.9851 11.0769 15.4134 11.657C14.8416 12.2287 14.1663 12.7466 13.3874 13.2106C12.7328 13.6 12.1942 14.006 11.7717 14.4286C11.3574 14.8512 11.0466 15.3401 10.8395 15.8952C10.6406 16.4504 10.5371 17.134 10.5288 17.946V18.3686H5.81818ZM8.27912 26.3232C7.45052 26.3232 6.74207 26.0331 6.15376 25.4531C5.57375 24.8648 5.28788 24.1605 5.29616 23.3402C5.28788 22.5282 5.57375 21.8321 6.15376 21.2521C6.74207 20.6721 7.45052 20.3821 8.27912 20.3821C9.06629 20.3821 9.75817 20.6721 10.3548 21.2521C10.9514 21.8321 11.2538 22.5282 11.2621 23.3402C11.2538 23.8871 11.1088 24.3884 10.8271 24.8441C10.5536 25.2915 10.1932 25.652 9.74574 25.9254C9.2983 26.1906 8.80942 26.3232 8.27912 26.3232Z"
            fill="#F7E6E6"
          />
        </Svg>
      </View>
      <Text style={styles.text}>{`vzdálenost ${distance} km`}</Text>
      <Svg width={10} height={18} viewBox="0 0 10 18" fill="none">
        <Path
          d="M1 17L9 9L1 1"
          stroke="#FEFBFB"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  entry: {
    height: 65,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.greyLight,
    borderRadius: 50,
    paddingLeft: 6,
    paddingRight: 12,
  },
  icon: {
    borderRadius: 50,
    backgroundColor: theme.grey,
    height: 54,
    width: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 22,
    color: theme.white,
  },
});
