import { StyleSheet, TouchableHighlight, View } from "react-native";

import { Text } from "./Text";

import { Region } from "react-native-maps";
import { DrawerCloseButton } from "./DrawerCloseButton";
import { SerachAddress } from "./SearchAddress";
import { UserMenu } from "./UserMenu";

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
  <>
    {items.map((item) => (
      <TouchableHighlight
        key={item.id}
        activeOpacity={1}
        underlayColor="#F7E6E6"
        onPress={() => onSelect(item.id)}
      >
        <View style={styles.menuItem}>
          <Text style={styles.menuItemText}>{item.name}</Text>
        </View>
      </TouchableHighlight>
    ))}
  </>
);

const Divider = () => (
  <View style={styles.divider}>
    <View style={styles.dividerLine} />
  </View>
);

type DrawerNavigationProps = {
  onClose: () => void;
  onSelect: (id: string) => void;
  setInitialRegion: (region: Region) => void;
};

export const DrawerNavigation = ({
  onClose,
  onSelect,
  setInitialRegion,
}: DrawerNavigationProps) => (
  <View style={styles.wrap}>
    <View style={styles.userMenu}>
      <UserMenu />
    </View>
    <View style={styles.search}>
      <SerachAddress
        onSelect={(coord) => {
          setInitialRegion({
            latitude: coord.lat,
            longitude: coord.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        }}
      />
    </View>
    <Divider />
    <NavigationPagesList items={menuItems} onSelect={onSelect} />
    <Divider />
    <NavigationPagesList items={menuItems2} onSelect={onSelect} />
    <View style={styles.closeButton}>
      <DrawerCloseButton onPress={onClose} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    width: "80%",

    position: "absolute",
    left: 0,
    bottom: 0,
    backgroundColor: "white",
    borderTopRightRadius: 34,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    paddingBottom: 10,
  },
  userMenu: {
    paddingLeft: 30,
    paddingTop: 35,
    paddingBottom: 18,
  },
  menuItem: {
    paddingLeft: 30,
    paddingTop: 12,
    paddingBottom: 12,
  },
  menuItemText: {
    fontSize: 20,
    color: "#393900",
  },
  divider: {
    paddingLeft: 30,
    paddingRight: 60,
    paddingTop: 12,
    paddingBottom: 12,
    width: "100%",
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#D1D1D1",
  },
  closeButton: {
    position: "absolute",
    top: 25,
    right: 25,
  },
  search: {
    width: "100%",
    paddingHorizontal: 20,
  },
});
