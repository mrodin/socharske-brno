import React, { FC, ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";

type AuthWrap = {
  children: ReactNode;
  showSubtitle?: boolean;
};

const Wrap: FC<AuthWrap> = ({ children, showSubtitle }) => {
  return (
    <View className="h-full px-5 bg-gray w-full flex align-center">
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View className="gap-4 justify-self-center flex items-center mb-16">
          <Text className="text-white text-[35px] text-center w-full font-krona">
            LOVCI SOCH
          </Text>
          {showSubtitle && (
            <Text className="text-white text-xl text-center w-[250px]">
              Vydej se na dobrodružství a ulov si brněnské sochy
            </Text>
          )}
        </View>
        {children}
      </ScrollView>
    </View>
  );
};

export default Wrap;
