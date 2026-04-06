import { defaultUserIconSource } from "@/utils/images";
import React, { FC, ReactNode } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "@/components/styled";

type ProfileDetailProps = {
  username?: string;
  avatarUrl: string | null;
  collectedStatuesCount: number;
  score: number;
  rank: number | null;
  action?: ReactNode;
  followingCount: number;
  followersCount: number;
  onPressCollectedStatues?: () => void;
  onPressScore?: () => void;
};

export const ProfileDetail: FC<ProfileDetailProps> = ({
  username,
  rank,
  avatarUrl,
  collectedStatuesCount,
  score,
  action,
  followersCount,
  followingCount,
  onPressCollectedStatues,
  onPressScore,
}) => {
  return (
    <>
      <View className="flex-col justify-center items-center gap-4">
        {username && (
          <View className="flex-row items-center gap-2">
            <Text className="text-white text-center font-bold text-3xl">
              {username}
            </Text>
            {action}
          </View>
        )}
        <Text className="text-gray-pale text-center">
          <Text className="font-semibold">{followersCount}</Text> sledujících ·{" "}
          <Text className="font-semibold">{followingCount}</Text> sleduje
        </Text>

        {rank !== null && (
          <View className="border-solid border-2 rounded-full border-red-light">
            <Text className="color-red-light px-[5px] py-[3px] font-bold">
              {rank}. místo
            </Text>
          </View>
        )}
        <Image
          source={avatarUrl ? { uri: avatarUrl } : defaultUserIconSource}
          accessibilityLabel="Avatar"
          style={{ width: 180, height: 180 }}
          className="object-cover rounded-full"
        />
      </View>

      <View className="gap-3 flex-row w-full pt-[30px]">
        <TouchableOpacity
          disabled={!onPressCollectedStatues}
          onPress={onPressCollectedStatues}
          className="bg-gray-darker flex-1 rounded-2xl px-3 py-4 gap-1"
        >
          <Text className="text-white">Ulovené sochy</Text>
          <Text className="text-4xl font-bold text-white">
            {collectedStatuesCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!onPressScore}
          onPress={onPressScore}
          className="flex-1"
        >
          <LinearGradient
            colors={["#DF4237", "#D5232A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="flex-1 rounded-2xl px-3 py-4 gap-1"
          >
            <Text className="text-white">Skóre</Text>
            <Text className="text-4xl font-bold text-white">{score}b</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </>
  );
};
