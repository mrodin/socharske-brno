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
  } as any);

  const response = await fetch(
    "https://us-central1-socharske-brno.cloudfunctions.net/upload_avatar",
    {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (response.status !== 200) {
    throw new Error(`Failed to upload avatar: ${data.error}`);
  }

  return data.url as string;
};
