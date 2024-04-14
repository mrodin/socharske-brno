import React, { FC, useCallback, useContext, useRef } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Statue } from "../types/statues";
import Svg, { Path } from "react-native-svg";
import { theme } from "../utils/theme";
import { useCollectStatue, useCollectedStatue } from "../api/statues";
import { FoundStatuesContext } from "../providers/FoundStatues";

type StatueDetailProps = {
  onClose: () => void;
  statue: Statue | null;
};

export const StatueDetail: FC<StatueDetailProps> = ({ onClose, statue }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [statueIds, refreshStateuIds] = useContext(FoundStatuesContext);
  const collectStateu = useCollectStatue();

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  if (!statue) {
    return null;
  }

  const { name, description, author, year, material, type, id } = statue;

  const alreadyCollected = statueIds.includes(id);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      snapPoints={["40%", "95%"]}
      backgroundStyle={{
        borderTopLeftRadius: HANDLE_BORDER_RADIUS,
        borderTopRightRadius: HANDLE_BORDER_RADIUS,
      }}
      handleComponent={() => (
        <ImageBackground
          source={require("../../assets/images/spravedlnost.png")}
          style={styles.image}
          imageStyle={{
            borderTopLeftRadius: HANDLE_BORDER_RADIUS,
            borderTopRightRadius: HANDLE_BORDER_RADIUS,
          }}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Svg width={24} height={24} viewBox="0 0 32 50">
              <Path
                d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"
                fill="white"
              />
            </Svg>
          </TouchableOpacity>
        </ImageBackground>
      )}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.layout}>
          <View style={styles.titleLayout}>
            <Text style={styles.title}>{name}</Text>
            <TouchableOpacity style={styles.collectButton}>
              <Text
                style={{ color: theme.white, fontWeight: "bold" }}
                onPress={() => collectStateu(id)?.then(refreshStateuIds)}
              >
                {alreadyCollected ? "Uloveno" : "Ulov sochu"}
              </Text>
            </TouchableOpacity>
          </View>

          {description && <Text style={styles.text}>{description}</Text>}

          <View style={styles.attributesLayout}>
            {author && <LabelValue label="Autor" value={author} />}
            {year && <LabelValue label="Rok vzniku" value={year} />}
            {material && <LabelValue label="Materiál" value={material} />}
            {type && <LabelValue label="Typ" value={type} />}
          </View>

          <TouchableOpacity style={styles.wikiLink}>
            <Svg width={17} height={17} viewBox="0 0 17 17">
              <Path
                d="M12.75 7.66416C12.5621 7.66416 12.3819 7.73878 12.2491 7.87162C12.1163 8.00446 12.0416 8.18463 12.0416 8.37249V13.4583C12.0416 13.6462 11.967 13.8264 11.8342 13.9592C11.7013 14.092 11.5212 14.1667 11.3333 14.1667H3.54163C3.35376 14.1667 3.1736 14.092 3.04076 13.9592C2.90792 13.8264 2.83329 13.6462 2.83329 13.4583V5.66666C2.83329 5.47879 2.90792 5.29863 3.04076 5.16579C3.1736 5.03295 3.35376 4.95832 3.54163 4.95832H8.62746C8.81532 4.95832 8.99549 4.8837 9.12833 4.75086C9.26116 4.61802 9.33579 4.43785 9.33579 4.24999C9.33579 4.06213 9.26116 3.88196 9.12833 3.74912C8.99549 3.61628 8.81532 3.54166 8.62746 3.54166H3.54163C2.97804 3.54166 2.43754 3.76554 2.03902 4.16405C1.64051 4.56257 1.41663 5.10307 1.41663 5.66666V13.4583C1.41663 14.0219 1.64051 14.5624 2.03902 14.9609C2.43754 15.3594 2.97804 15.5833 3.54163 15.5833H11.3333C11.8969 15.5833 12.4374 15.3594 12.8359 14.9609C13.2344 14.5624 13.4583 14.0219 13.4583 13.4583V8.37249C13.4583 8.18463 13.3837 8.00446 13.2508 7.87162C13.118 7.73878 12.9378 7.66416 12.75 7.66416ZM15.5266 1.85582C15.4547 1.68274 15.3172 1.5452 15.1441 1.47332C15.059 1.43703 14.9675 1.41778 14.875 1.41666H10.625C10.4371 1.41666 10.2569 1.49128 10.1241 1.62412C9.99125 1.75696 9.91663 1.93713 9.91663 2.12499C9.91663 2.31285 9.99125 2.49302 10.1241 2.62586C10.2569 2.7587 10.4371 2.83332 10.625 2.83332H13.1679L5.87204 10.1221C5.80565 10.1879 5.75296 10.2663 5.71699 10.3526C5.68103 10.4389 5.66252 10.5315 5.66252 10.625C5.66252 10.7185 5.68103 10.8111 5.71699 10.8974C5.75296 10.9837 5.80565 11.0621 5.87204 11.1279C5.93789 11.1943 6.01623 11.247 6.10255 11.283C6.18887 11.3189 6.28145 11.3374 6.37496 11.3374C6.46847 11.3374 6.56105 11.3189 6.64737 11.283C6.73368 11.247 6.81203 11.1943 6.87788 11.1279L14.1666 3.83207V6.37499C14.1666 6.56285 14.2413 6.74302 14.3741 6.87586C14.5069 7.0087 14.6871 7.08332 14.875 7.08332C15.0628 7.08332 15.243 7.0087 15.3758 6.87586C15.5087 6.74302 15.5833 6.56285 15.5833 6.37499V2.12499C15.5822 2.03243 15.5629 1.94098 15.5266 1.85582Z"
                fill="#D8483E"
              />
            </Svg>
            <Text style={{ color: theme.redLight }}>
              Zjistit více v internetové encyklopedii
            </Text>
          </TouchableOpacity>

          <UserPhotos />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const UserPhotos: FC = () => (
  <View>
    <Text>Fotky dalších lovců</Text>
  </View>
);

type LabelValueProps = {
  label: string;
  value: string;
};

const LabelValue: FC<LabelValueProps> = ({ label, value }) => (
  <View style={styles.labelValueContainer}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const HANDLE_BORDER_RADIUS = 50;

const styles = StyleSheet.create({
  attributesLayout: {},
  closeButton: {
    padding: 8,
    marginRight: 24,
  },
  collectButton: {
    backgroundColor: theme.red,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    padding: 24,
    backgroundColor: theme.grey,
    height: "100%",
  },
  image: {
    width: "100%",
    height: 220,
    alignItems: "flex-end",
    paddingTop: 12,
  },
  label: {
    color: theme.white,
    flex: 1,
    fontWeight: "bold",
  },
  labelValueContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  layout: {
    flexDirection: "column",
    gap: 24,
  },
  text: {
    color: theme.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.white,
  },
  titleLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  value: {
    color: theme.white,
    textAlign: "right",
  },
  wikiLink: {
    borderColor: theme.redLight,
    borderWidth: 1,
    borderRadius: 50,
    padding: 8,
    flexDirection: "row",
    gap: 8,
  },
});
