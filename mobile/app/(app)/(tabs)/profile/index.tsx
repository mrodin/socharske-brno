import { useState, useEffect, useContext } from "react";
import { ScrollView, View } from "react-native";

import { Button } from "@/components/Button";
import { UserInfoContext } from "@/providers/UserInfo";
import { router } from "expo-router";
import { useGetCollectedStatues } from "@/api/queries";
import { useUserStatistics } from "@/hooks/useUserStatistics";
import { ProfileDetail } from "@/components/ProfileDetail";

const Profile = () => {
  const { userInfo } = useContext(UserInfoContext);
  const [username, setUsername] = useState("");
  const { data: collectedStatues } = useGetCollectedStatues();
  const userStatistics = useUserStatistics();

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
    }
  }, [userInfo]);

  if (!userInfo || !userStatistics)
    return <View className="bg-gray h-full w-full" />;

  return (
    <ScrollView automaticallyAdjustKeyboardInsets>
      <View className="p-5">
        <ProfileDetail
          username={username}
          score={userStatistics.score}
          rank={userStatistics.rank}
          avatarUrl={userInfo.avatarUrl}
          collectedStatuesCount={collectedStatues.length}
        />

        <View className="gap-4 pt-[30px]">
          <Button
            variant="secondary"
            title="Upravit profil"
            onPress={() => {
              router.navigate("/profile/edit-profile");
            }}
          />
          <Button
            variant="primary"
            title="Odhlásit se"
            onPress={async () => {
              router.replace("/sign-out");
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
