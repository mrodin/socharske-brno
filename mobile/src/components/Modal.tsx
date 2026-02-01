import React, { FC } from "react";
import { Modal as RNModal, View } from "react-native";

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal: FC<ModalProps> = ({ visible, onClose, children }) => (
  <RNModal onRequestClose={onClose} transparent visible={visible}>
    <View className="flex-1 justify-center items-center bg-black/50">
      <View
        className="m-5 bg-white rounded-[20px] p-9 items-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.45,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        {children}
      </View>
    </View>
  </RNModal>
);
