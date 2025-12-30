import { useState, useContext } from "react";
import {
  Alert,
  View,
  Image,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { uploadAvatar } from "../api/avatar";
import { UserInfoContext } from "../providers/UserInfo";
import { UserSessionContext } from "../providers/UserSession";
import { CheckIconOutline } from "@/icons/CheckIconOutline";

interface Props {
  size: number;
  onUpload: (filePath: string) => void;
}

export default function Avatar({ size, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const { userInfo } = useContext(UserInfoContext);
  const { session } = useContext(UserSessionContext);
  const [avatarUpdated, setAvatarUpdated] = useState(false);

  async function handleClickUploadAvatar() {
    try {
      if (!session) return;

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

      // Ensure the image is always a square crop (center crop)
      const width = image.width ?? 0;
      const height = image.height ?? 0;
      let finalUri = image.uri;

      if (width !== height && width > 0 && height > 0) {
        const size = Math.min(width, height);
        const originX = (width - size) / 2;
        const originY = (height - size) / 2;

        const manipulated = await ImageManipulator.manipulateAsync(
          image.uri,
          [
            {
              crop: {
                originX,
                originY,
                width: size,
                height: size,
              },
            },
          ],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );
        finalUri = manipulated.uri;
      }

      setUploading(true);
      setAvatarUpdated(false);

      const nextAvatarUrl = await uploadAvatar(finalUri, token);
      onUpload(nextAvatarUrl);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
      setAvatarUpdated(true);
    }
  }

  return (
    <View className="flex justify-center items-center gap-2">
      <View
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
        {uploading && (
          <>
            <View
              style={{
                width: size,
                height: size,
              }}
              className="absolute top-0 left-0 bg-gray-light rounded-full opacity-60"
            />
            <ActivityIndicator
              size="large"
              color="#ffffff"
              className="absolute top-0 left-0 right-0 bottom-0"
            />
          </>
        )}
      </View>
      <View className="flex justify-center items-center">
        <Pressable
          onPress={handleClickUploadAvatar}
          disabled={uploading}
          className="flex flex-row gap-3 items-center"
        >
          {avatarUpdated && (
            <View className="bg-green-500 rounded-full w-6 h-6 items-center justify-center">
              <CheckIconOutline />
            </View>
          )}
          <Text className="color-white underline">Nahrát novou fotku</Text>
        </Pressable>
      </View>
    </View>
  );
}
