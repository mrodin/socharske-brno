import { useContext } from "react";
import { ScrollView, View } from "react-native";

import { UserInfoContext } from "@/providers/UserInfo";
import { useGetCollectedStatues } from "@/api/queries";
import { useUserStatistics } from "@/hooks/useUserStatistics";
import { ProfileDetail } from "@/components/ProfileDetail";
import Menu from "@/components/Menu";
import { router } from "expo-router";

const Profile = () => {
  const { userInfo } = useContext(UserInfoContext);
  const { data: collectedStatues } = useGetCollectedStatues();
  const userStatistics = useUserStatistics();

  if (!userInfo || !userStatistics)
    return <View className="bg-gray h-full w-full" />;

  return (
    <ScrollView automaticallyAdjustKeyboardInsets>
      <View className="p-5">
        <ProfileDetail
          score={userStatistics.score}
          rank={userStatistics.rank}
          avatarUrl={userInfo.avatarUrl}
          collectedStatuesCount={collectedStatues.length}
          onPressScore={() => router.replace("/leaderboard")}
          onPressCollectedStatues={() => router.replace("/my-statues")}
        />

        <Menu.List className="pt-[30px]">
          <Menu.Item onPress={() => router.navigate("/profile/edit-profile")}>
            Upravit profil
          </Menu.Item>
          <Menu.Item onPress={() => {}}>Nastavení hry</Menu.Item>
          <Menu.Item onPress={() => {}}>Pravidla hry</Menu.Item>
          <Menu.Item onPress={() => {}}>Podmínky používání</Menu.Item>
          <Menu.Item onPress={() => router.replace("/sign-out")}>
            Odhlásit se
          </Menu.Item>
          <Menu.Item
            textClassName="text-red-lightest underline"
            onPress={() => router.navigate("/profile/delete-profile")}
          >
            Smazat účet
          </Menu.Item>
        </Menu.List>
      </View>
    </ScrollView>
  );
};

export default Profile;
