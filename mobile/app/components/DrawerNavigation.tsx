import { StyleSheet, View, TouchableHighlight } from "react-native";

import { Text } from "./Text";

import { DrawerCloseButton } from "./DrawerCloseButton";
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

function Menu({
  items,
  onSelect,
}: {
  items: MenuEntry[];
  onSelect: (id: string) => void;
}) {
  return (
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
}

function Divider() {
  return (
    <View style={styles.divider}>
      <View style={styles.dividerLine} />
    </View>
  );
}

export function DrawerNavigation({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.userMenu}>
        <UserMenu />
      </View>
      <Divider />
      <Menu items={menuItems} onSelect={onSelect} />
      <Divider />
      <Menu items={menuItems2} onSelect={onSelect} />
      <View style={styles.closeButton}>
        <DrawerCloseButton onPress={onClose} />
      </View>
    </View>
  );
}

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
});
