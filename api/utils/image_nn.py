import base64
import io

from PIL import Image
from torchvision import transforms, models
from torch import nn
import torch

transform = transforms.Compose([
    transforms.Resize(size=256),
    transforms.CenterCrop(size=224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def preprocess_image(image_b64: str) -> torch.Tensor:
    image_data = base64.b64decode(image_b64.split(",")[1])
    images = Image.open(io.BytesIO(image_data)).convert("RGB")
    return transform(images).unsqueeze(0) # shape: (1, 3, 224, 224)