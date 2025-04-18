import { useState, useContext } from "react";
import { Alert, View, Image, Pressable, Text } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { uploadAvatar } from "../api/avatar";
import { UserInfoContext } from "../providers/UserInfo";
import { UserSessionContext } from "../providers/UserSession";

interface Props {
  size: number;
  onUpload: (filePath: string) => void;
}

export default function Avatar({ size, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const { userInfo } = useContext(UserInfoContext);
  const { session } = useContext(UserSessionContext);

  async function handleClickUploadAvatar() {
    try {
      if (!session) return;

      setUploading(true);

      const token = session.access_token;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        aspect: [1, 1], // Square aspect ratio
        exif: false, // We don't want nor need that data.
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        // User cancelled image picker
        return;
      }

      const image = result.assets[0];

      if (!image.uri) {
        throw new Error("No image uri!"); // Realistically, this should never happen, but just in case...
      }

      const nextAvatarUrl = await uploadAvatar(image.uri, token);
      onUpload(nextAvatarUrl);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View className="flex justify-center items-center">
      <Pressable
        onPress={handleClickUploadAvatar}
        disabled={uploading}
        style={{ width: size, height: size }}
        className="flex justify-start items-start bg-gray-light rounded-full"
      >
        {userInfo?.avatarUrl && (
          <Image
            source={{ uri: userInfo.avatarUrl }}
            accessibilityLabel="Avatar"
            style={{
              width: size,
              height: size,
            }}
            className="object-cover rounded-full border-2 border-[rgb(169,169,169)]"
          />
        )}
        <View
          style={{
            width: size,
            height: size,
          }}
          className="flex justify-center items-center absolute"
        >
          <Text className="color-white">Nahrát novou fotku</Text>
        </View>
      </Pressable>
    </View>
  );
}
