import os
from PIL import Image

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
# Define the path to the '''images''' directory
images_base_dir = os.path.join(script_dir, """images""")

# Target size for the longer side
TARGET_SIZE = 480
THUMB_DIR_NAME = """thumb480"""
SOURCE_IMAGE_NAME = """1.JPEG"""


def resize_image(image_path, output_path, target_size):
    try:
        img = Image.open(image_path)
        width, height = img.size

        if width > height:
            new_width = target_size
            new_height = int(height * (target_size / width))
        else:
            new_height = target_size
            new_width = int(width * (target_size / height))

        resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        resized_img.save(output_path, """JPEG""")
        print(f"Resized {image_path} to {output_path} ({new_width}x{new_height})")
    except FileNotFoundError:
        print(f"Error: Source image not found at {image_path}")
    except Exception as e:
        print(f"Error processing {image_path}: {e}")


def process_statue_folders(base_dir):
    if not os.path.isdir(base_dir):
        print(f"Error: Base directory '{base_dir}' not found.")
        return

    for item_name in os.listdir(base_dir):
        item_path = os.path.join(base_dir, item_name)
        # Check if it's a directory and its name is a number (statue ID)
        if os.path.isdir(item_path) and item_name.isdigit():
            statue_id_dir = item_path
            print(f"Processing folder: {statue_id_dir}")

            # 1. Create a new folder "thumb96" inside
            thumb_dir_path = os.path.join(statue_id_dir, THUMB_DIR_NAME)
            os.makedirs(thumb_dir_path, exist_ok=True)
            print(f"Ensured '{THUMB_DIR_NAME}' directory exists at: {thumb_dir_path}")

            # Path to the source image
            source_image_path = os.path.join(statue_id_dir, SOURCE_IMAGE_NAME)

            # Path to the resized output image
            output_image_path = os.path.join(thumb_dir_path, SOURCE_IMAGE_NAME)

            # 2. Resize and save the image
            if os.path.exists(source_image_path):
                resize_image(source_image_path, output_image_path, TARGET_SIZE)
            else:
                print(f"Source image {SOURCE_IMAGE_NAME} not found in {statue_id_dir}")


if __name__ == "__main__":
    process_statue_folders(images_base_dir)
    print("Image resizing process completed.")
