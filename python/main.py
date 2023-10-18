import os
import io
import warnings
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation
from torchvision.transforms import GaussianBlur

# Our host url should not be prepended with "https" nor should it have a trailing slash.
os.environ['STABILITY_HOST'] = 'grpc.stability.ai:443'

# Sign up for an account at the following link to get an API Key.
# https://platform.stability.ai/

# Click on the following link once you have created an account to be taken to your API Key.
# https://platform.stability.ai/account/keys

# Paste your API Key below.

os.environ['STABILITY_KEY'] = 'sk-MZRYCVSNKNO6PTTA2Gfh2e0RmC8KjrKQ6FHGENkpzM6Q3Fxl'

# Set up our connection to the API.
stability_api = client.StabilityInference(
    key=os.environ['STABILITY_KEY'], # API Key reference.
    verbose=True, # Print debug messages.
    engine="stable-diffusion-xl-1024-v1-0", # Set the engine to use for generation.
    # Check out the following link for a list of available engines: https://platform.stability.ai/docs/features/api-parameters#engine
)

img = Image.open('./ai-source/image3.png')

# Duckin fonts and stuff

img_mask_width, img_mask_height = 1024, 1024
mask = Image.new('L', (img_mask_width, img_mask_height), 'white')
d = ImageDraw.Draw(mask)
m = ImageDraw.Draw(img)
throwupz_path = "./fonts/throwupz.ttf"
urban_blocker_path = "./fonts/urban_blocker_solid.ttf"
another_tag_path = "./fonts/another_tag.ttf"
font1 = ImageFont.truetype(throwupz_path, size=300)
font2 = ImageFont.truetype(urban_blocker_path, size=300)
font3 = ImageFont.truetype(another_tag_path, size=300)

text = "PERDU !"
x, y = 100, 100

outline_width = 5
for i in range(-outline_width, outline_width + 1):
    for j in range(-outline_width, outline_width + 1):
        d.text((x + i, y + j), text, fill='black', font=font2)

# m.text((x, y), text, fill='black', font=font1)

mask.save('./ai-source/maskfont3.png')

mask_filling = Image.open('./ai-source/maskfont3.png')
np_mask = np.array(mask_filling)
np_mask_inverted = cv2.bitwise_not(np_mask)
contours, hierarchy = cv2.findContours(np_mask_inverted, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
contours = [c for c in contours if cv2.contourArea(c) > 20]

contour_centers = []
for contour in contours:
    M = cv2.moments(contour)
    if M["m00"] != 0:
        cX = int(M["m10"] / M["m00"])
        cY = int(M["m01"] / M["m00"])
        contour_centers.append([cX, cY])

for contour_center in contour_centers:
    ImageDraw.floodfill(mask_filling, (contour_center[0], contour_center[1]), value=0, thresh=100)

for contour_center in contour_centers:
    cv2.circle(np_mask, (contour_center[0], contour_center[1]), radius=20, color=(0,255,255), thickness=-1)

mask_circles = Image.fromarray(np_mask)
mask_circles.save('./ai-source/maskcircles.png')
# Feathering the edges of our mask generally helps provide a better result. Alternately, you can feather the mask in a suite like Photoshop or GIMP.

blur = GaussianBlur(7,5)
mask_blurred = blur(mask_filling)
mask_filling.save('./ai-source/masktest.png')

answers = stability_api.generate(
    prompt=("letters, 'P E R D U !', graffiti font"),
    init_image=img,
    mask_image=mask_blurred,
    start_schedule=1,
                   # If attempting to transform an image that was previously generated with our API,
                   # initial images benefit from having their own distinct seed rather than using the seed of the original image generation.
    steps=50, # Amount of inference steps performed on image generation. Defaults to 30.
    cfg_scale=25.0, # Influences how strongly your generation is guided to match your prompt.
                   # Setting this value higher increases the strength in which it tries to match your prompt.
                   # Defaults to 7.0 if not specified.
    width=1024, # Generation width, if not included defaults to 512 or 1024 depending on the engine.
    height=1024, # Generation height, if not included defaults to 512 or 1024 depending on the engine.
    sampler=generation.SAMPLER_K_DPMPP_2M # Choose which sampler we want to denoise our generation with.
                                                 # Defaults to k_lms if not specified. Clip Guidance only supports ancestral samplers.
                                                 # (Available Samplers: ddim, plms, k_euler, k_euler_ancestral, k_heun, k_dpm_2, k_dpm_2_ancestral, k_dpmpp_2s_ancestral, k_lms, k_dpmpp_2m, k_dpmpp_sde)
)

# Set up our warning to print to the console if the adult content classifier is tripped.
# If adult content classifier is not tripped, save generated image.
for resp in answers:
    for artifact in resp.artifacts:
        if artifact.finish_reason == generation.FILTER:
            warnings.warn(
                "Your request activated the API's safety filters and could not be processed."
                "Please modify the prompt and try again.")
        if artifact.type == generation.ARTIFACT_IMAGE:
            global img2
            img2 = Image.open(io.BytesIO(artifact.binary))
            img2.save("./ai-end/"+str(artifact.seed)+ ".png") # Save our completed image with its seed number as the filename.

