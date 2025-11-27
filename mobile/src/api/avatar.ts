import { supabase } from "@/utils/supabase";
import * as ImageManipulator from "expo-image-manipulator";

const MAX_AVATAR_SIZE = 400;

export const uploadAvatar = async (imageUri: string, token: string) => {
  const manipulatedImage = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: MAX_AVATAR_SIZE, height: MAX_AVATAR_SIZE } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );

  const formData = new FormData();
  formData.append("file", {
    uri: manipulatedImage.uri,
    type: "image/jpeg",
    name: "avatar.jpg",
  } as unknown as Blob);

  const { error, data } = await supabase.functions.invoke("upload_avatar", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (error) {
    console.log(error);
    throw new Error(`Failed to upload avatar: ${error}`);
  }

  return data.url as string;
};
