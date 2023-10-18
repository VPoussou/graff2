# your_script.py

print('checkimport')
import os
import random
print('checkPIL')
from PIL import Image
print('afterPIL')
print('checkimport')
import sys
import math
print('afterimport')
trans_list = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "@",
    "#",
    "&",
    "'",
    "(",
    "!",
    "_",
    "^",
    "*",
    "$",
    "%",
    "/",
    "ç",
    "€"
]
le_trans = {}
for count, i in enumerate(trans_list):
    le_trans[i] = count
print(le_trans['A'])


def get_random_folder(base_folder):
    # Step 2: Choose a folder at random
    subfolders = [f for f in os.listdir(base_folder) if os.path.isdir(os.path.join(base_folder, f))]
    random_folder = random.choice(subfolders)
    return os.path.join(base_folder, random_folder)

def calculate_composite_size(text, font_folder):
    print('inCalc')
    total_width = 0
    max_height = 0
    min_width = 100000

    for char in text.upper():
        # Step 3: Load letter images and calculate total width and maximum height
        image_path = os.path.join(font_folder, f'{le_trans[char] if le_trans[char] else 0}.png')
        letter_image = Image.open(image_path)
        total_width += letter_image.width
        max_height = max(max_height, letter_image.height)
        print(f"Letter {char} has width {letter_image.width}")
        min_width = min(min_width, letter_image.width)
    
    return total_width, max_height, min_width

def create_composite_image(text, font_folder, composite_width, composite_height, min_width):
    # Step 4: Create a composite image based on the text
    print('inCreate')
    new_img = Image.new('RGBA', (composite_width, composite_height), color=(0, 0, 0, 0))
    offset = int(min_width / 5)
    print(f"Offset: {offset}")
    current_x = 0
    print('inCreate2')
    for char in text.upper():
        # Load letter images and overlay them
        print(char)
        print(le_trans[char])
        print(os.path.join(font_folder, f'{le_trans[char] if le_trans[char] else 0}.png'))
        image_path = os.path.join(font_folder, f'{le_trans[char] if le_trans[char] else 0}.png')
        letter_image = Image.open(image_path)
        temp_alpha = Image.new('RGBA', (composite_width, composite_height), color=(0, 0, 0, 0))
        print('created temp alpha')
        temp_alpha.paste(letter_image, (current_x, 0))
        print('pasted')
        new_img = Image.alpha_composite(new_img, temp_alpha)
        print(f"Letter {char} with offset {offset} pasted at {current_x}")
        current_x += letter_image.width - offset
        print(f"Current x: {current_x}")
    new_img = new_img.crop(new_img.getbbox())
    return new_img

def save_image(image, output_folder, output_name):
    # Step 5: Save the composite image
    output_path = os.path.join(output_folder, output_name)
    image.save(output_path)
    return output_path
print('boop')
print(__name__)
if __name__ == "__main__":
    # Step 0: Get the text sent as data
    print('inMain')
    print(os.environ.get('TEXT_VARIABLE', '').strip())
    textU = os.environ.get('TEXT_VARIABLE', '').strip()
    print(f"Text received: {textU}")
    # Assuming your font folder is in the same directory as the script

    base_folder = os.getcwd() + '/' + 'dafonts'
    print(f"Base folder set to {base_folder}")

    # Choose a random font folder
    font_folder = get_random_folder(base_folder)
    print(f"Random font folder selected: {font_folder}")

    # Calculate the width and height of the composite image
    composite_width, composite_height, min_width = calculate_composite_size(textU, font_folder)
    print(f"Composite image size calculated: {composite_width}x{composite_height} with minimum width {min_width}")

    # Create a composite image
    composite_image = create_composite_image(textU, font_folder, composite_width, composite_height, min_width)
    print("Composite image created")

    # Specify the folder to save the image
    output_folder = os.getcwd() + '/' + 'tempImgs'
    print(f"Output folder set to {output_folder}")

    # Specify the name of the output image
    output_name = f'{textU}_composite.png'
    print(f"Output image name set to {output_name}")

    # Save the image and get the path
    image_path = save_image(composite_image, output_folder, output_name)
    print(f"Image saved at {image_path}")

    # Output the path of the saved image
    print(f"Path of the saved image: {image_path}")

    # Exit with a success code
    sys.exit(0)
