import { StyleSheet, TouchableHighlight } from "react-native";

import { View } from "../View";
import { Text } from "../Text";

import { Region } from "react-native-maps";
import { NavigationCloseButton } from "./NavigationCloseButton";
import { SerachAddress } from "./SearchAddress";
import { UserMenu } from "../UserMenu";
import { GpsButton } from "../GpsButton";

type MenuEntry = {
  id: string;
  name: string;
};
const menuItems: MenuEntry[] = [
  { id: "myStatues", name: "Moje sochy" },
  { id: "leaderBoard", name: "Nejlepší lovci soch" },
  { id: "trophies", name: "Trofeje" },
  { id: "trails", name: "Sochařské stezky" },
  { id: "photos", name: "Foto soutěže" },
];

const menuItems2: MenuEntry[] = [
  { id: "layers", name: "Vrstvy" },
  { id: "settings", name: "Nastavení" },
];

type MenuProps = {
  items: MenuEntry[];
  onSelect: (id: string) => void;
};

const NavigationPagesList = ({ items, onSelect }: MenuProps) => (
  <View className="w-full flex-col justify-start items-start inline-flex">
    {items.map((item) => (
      <TouchableHighlight
        key={item.id}
        activeOpacity={1}
        underlayColor="#DE4237"
        onPress={() => onSelect(item.id)}
        style={{ width: "100%" }}
      >
        <View className="w-full px-[25px] py-[15px] flex justify-start items-start">
          <Text className="text-gray-pale text-xl font-normal leading-snug">
            {item.name}
          </Text>
        </View>
      </TouchableHighlight>
    ))}
  </View>
);

const Divider = () => (
  <View className="w-[80%] h-[0px] mx-[25px] border border-neutral-600" />
);

type DrawerNavigationProps = {
  onClose: () => void;
  onSelect: (id: string) => void;
  setOriginRegion: (region: Region) => void;
};

export const DrawerNavigation = ({
  onClose,
  onSelect,
  setOriginRegion,
}: DrawerNavigationProps) => (
  <View className="absolute left-0 bottom-0 pb-6 min-w-[80%] max-w-[90%] bg-neutral-700 rounded-tr-[30px] justify-start items-start inline-flex">
    <View className="w-full border-b-2 border-neutral-500 justify-between items-center flex flex-row">
      <View className="px-[25px] py-[18px]">
        <UserMenu />
      </View>
      <NavigationCloseButton onPress={onClose} />
    </View>
    <View className="w-full px-[25px] pt-[25px] pb-1.5 flex flex-row">
      <SerachAddress
        onSelect={(coord) => {
          setOriginRegion({
            latitude: coord.lat,
            longitude: coord.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        }}
      />
      <GpsButton />
    </View>
    <NavigationPagesList items={menuItems} onSelect={onSelect} />
    <Divider />
    <NavigationPagesList items={menuItems2} onSelect={onSelect} />
  </View>
);
