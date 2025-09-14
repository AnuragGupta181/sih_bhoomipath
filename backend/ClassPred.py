import pickle

# Load the model
with open("Metal_Class_Predictor.pkl", "rb") as f:
    model = pickle.load(f)

# Function to predict category
def category(sample_data: dict):
    """
    sample_data: dict with keys ['R_10','R_8','R_6','G_10','G_8','G_6','B_10','B_8','B_6']
    Returns: predicted class
    """
    # Ensure correct order of features and convert to float
    feature_order = ['R_10','R_8','R_6','G_10','G_8','G_6','B_10','B_8','B_6']
    sample_x = [float(sample_data[key]) for key in feature_order]
    
    y_pred = model.predict([sample_x])
    return y_pred[0]
