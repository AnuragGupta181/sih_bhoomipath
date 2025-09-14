from keras.models import load_model
import pickle
import numpy as np
from modelClass import LCAmodel



model = load_model(
    "LCA_value_predictor.keras", 
    custom_objects={"LCAmodel": LCAmodel}
)

with open("LabelEncoders.pkl", "rb") as f:
    LabelEncoders = pickle.load(f)

def Encoded_val(sample_row):
    ld = []
    mask = []
    for key, val in sample_row.items():
        if val is not None:
            if key in LabelEncoders:
                if val in LabelEncoders[key].classes_:
                    encoded = LabelEncoders[key].transform([val])[0]
                else:
                    encoded = 0
                ld.append(encoded)
            else:
                ld.append(val)
            mask.append(1)
        else:
            ld.append(0.0)
            mask.append(0)
    return np.array(ld, dtype=np.float32), np.array(mask, dtype=np.float32)



def modelPred(sample_row):
        
    X, mask = Encoded_val(sample_row)

    X_input = X.reshape(1, -1)
    mask_input = mask.reshape(1, -1)
    pred = model.predict([X_input, mask_input])

    result = {}
    columns = [
        "Process_Type", 
        "Metal",
        "Energy_MJ_per_kg",
        "Quantity_kg",
        "Energy_MJ_total",
        "Transport_km",
        "Transport_Mode",
        "Transport_emissions_kgCO2",
        "Water_use_m3_per_ton",
        "End_of_Life",
        "Circularity_option",
        "Process_emissions_kgCO2",
        "Total_emissions_kgCO2",
        "Emission_factor_kgCO2_per_MJ"
    ]



    for i, m, v in zip(columns, mask, pred[0]):
        if m != 0:
            result[i] = sample_row[i]
        else:
            if i in LabelEncoders:
                v=int(round(v))
                if v<0 : v=0

                inv = LabelEncoders[i].inverse_transform([v])[0]
                result[i] = inv
            else:
                result[i] = round(float(v), 2)

    return result
