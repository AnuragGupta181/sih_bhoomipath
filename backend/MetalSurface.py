import numpy as np
from keras.models import load_model
from PIL import Image
import cv2

model = load_model("Metal_image_Damage_Identifier.keras")

class_names = ['Crazing', 'Inclusion', 'Patches', 'Pitted', 'Rolled', 'Scratches']

def predict_metal_damage(pil_img: Image.Image) -> str:

    img = np.array(pil_img.convert("RGB"))

    img = cv2.resize(img, (224, 224))

    img = img / 255.0

    img = np.expand_dims(img, axis=0)

    pred = model.predict(img)
    pred_class = np.argmax(pred, axis=1)[0]

    return class_names[pred_class]


