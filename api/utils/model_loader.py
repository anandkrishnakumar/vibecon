import torch

def load_model(path="/Users/anandkrishnakumar/Coding/vibecon/recommender/nn/saved_models/resnet50_vibe_model.pth"):
    model = torch.load(path, map_location=torch.device('cpu'), weights_only=False)
    model.eval()
    return model