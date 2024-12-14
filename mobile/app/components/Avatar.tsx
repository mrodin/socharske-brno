import { useState, useContext } from "react";
import { supabase } from "../utils/supabase";
import {
  StyleSheet,
  View,
  Alert,
  Image,
  Pressable as PresaableNative,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UserAvatarContext } from "../providers/UserAvatar";
import { styled } from "nativewind";

const Pressable = styled(PresaableNative);

interface Props {
  size: number;
  onUpload: (filePath: string) => void;
}

export default function Avatar({ size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const avatarSize = { height: size, width: size };
  const { url } = useContext(UserAvatarContext);

  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        aspect: [1, 1], // Square aspect ratior
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

      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer()
      );

      const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/jpeg",
        });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(data.path);
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
    <Pressable onPress={uploadAvatar} disabled={uploading}>
      {url ? (
        <Image
          source={{ uri: url }}
          accessibilityLabel="Avatar"
          style={[avatarSize, styles.avatar, styles.image]}
        />
      ) : (
        <View style={[avatarSize, styles.avatar, styles.noImage]} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 999, // 100% not working in React Native
    overflow: "hidden",
    maxWidth: "100%",
  },
  image: {
    objectFit: "cover",
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: "#333",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgb(200, 200, 200)",
    borderRadius: 5,
  },
});
