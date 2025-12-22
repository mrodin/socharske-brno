import React, { FC, ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft } from "@/icons/ArrowLeft";

const SUBTITLE_TEXT =
  "Vydej se na dobrodružství\na ulov si brněnské sochy!\n Začni vytvořením účtu níže.";

type WrapProps = {
  children: ReactNode;
  showSubtitle?: boolean;
  showGoBack?: boolean;
};

const Wrap: FC<WrapProps> = ({ children, showSubtitle, showGoBack }) => {
  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
      }}
      className="bg-gray"
    >
      <SafeAreaView className="h-full w-full flex align-center px-5 pb-10">
        <View className="h-[50px]">
          {showGoBack && (
            <Pressable
              className="absolute text-white py-0 self-start flex-row items-center "
              onPress={() => router.back()}
            >
              <ArrowLeft width={10} />
              <Text className="text-white ml-3">zpět</Text>
            </Pressable>
          )}
        </View>
        <View className="gap-4 justify-self-center flex items-center mb-12">
          <Text className="text-white text-[35px] text-center w-full font-krona">
            LOVCI SOCH
          </Text>
          {showSubtitle && (
            <Text className="text-white text-xl text-center w-[250px]">
              {SUBTITLE_TEXT}
            </Text>
          )}
        </View>
        {children}
      </SafeAreaView>
    </ScrollView>
  );
};

export default Wrap;
