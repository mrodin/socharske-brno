import { useToggleProfileFollow, useGetFollowedProfiles } from "@/api/queries";
import { FollowProfileButton } from "@/components/FollowProfileButton";
import { SearchProfileButton } from "@/components/leaderboard/SearchProfileButton";
import { useUserInfo } from "@/providers/UserInfo";
import { stackScreenOptions } from "@/utils/theme";
import { router, Stack, useGlobalSearchParams } from "expo-router";

const SearchPlayers = () => {
  return (
    <SearchProfileButton
      onPress={function (): void {
        router.navigate("/leaderboard/search");
      }}
    />
  );
}

const FollowProfile = () => {
  const { id: rawId } = useGlobalSearchParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const { userInfo } = useUserInfo();
  const { mutate: toggleFollow, isPending } = useToggleProfileFollow();
  const { data: followedProfiles } = useGetFollowedProfiles();

  if (!id || !userInfo?.id || userInfo.id === id) {
    return null;
  }

  return (
      <FollowProfileButton
        disabled={isPending}
        isFollowing={followedProfiles?.some(
          (profileId) => profileId === id
        )}
        onPress={() => toggleFollow(id)}
      />
  )
}

export default function RootLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen options={{ title: "Hráči", headerRight: SearchPlayers }} name="index" />
      <Stack.Screen options={{ title: "Hráč", headerRight: FollowProfile }} name="profile" />
      <Stack.Screen options={{ title: "Hledat hráče" }} name="search" />
    </Stack>
  );
}
