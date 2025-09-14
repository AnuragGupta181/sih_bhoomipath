import requests
sample_data= sample_row = {
        "Process_Type": "Primary",
        "Metal": "Aluminium",
        "Energy_MJ_per_kg": 210.5,
        "Quantity_kg": 1200,
        "Energy_MJ_total": 0.0,
        "Transport_km": 150.0,
        "Transport_Mode": "Truck",
        "Transport_emissions_kgCO2": 45.7,
        "Water_use_m3_per_ton": 6.8,
        "End_of_Life": "Recycle",
        "Circularity_option": "Closed-loop",
        "Process_emissions_kgCO2": 520.3,
        "Total_emissions_kgCO2": 0.0,
        "Emission_factor_kgCO2_per_MJ": 0.0021
    }

# url = "http://127.0.0.1:5000/predict_missing"   # <-- server route yaha sahi karo
# data = {
#   "sample":sample_data,
#   "question":"do lca and give me report acc to the data i gave"
# }

# response = requests.post(url, json=data)
# print("Status Code:", response.status_code)
# print("Response Text:", response.text)   # <- pehle yeh print karo
# try:
#     print("Response JSON:", response.json())
# except Exception:
#     print("Not a JSON response")






# sample_data= sample_row = {
#         "Process_Type": "Primary",
#         "Metal": "Aluminium",
#         "Energy_MJ_per_kg": 210.5,
#         "Quantity_kg": 1200,
#         "Energy_MJ_total": 99,
#         "Transport_km": 150.0,
#         "Transport_Mode": "Truck",
#         "Transport_emissions_kgCO2": 45.7,
#         "Water_use_m3_per_ton": 6.8,
#         "End_of_Life": "Recycle",
#         "Circularity_option": "Closed-loop",
#         "Process_emissions_kgCO2": 520.3,
#         "Total_emissions_kgCO2": 99,
#         "Emission_factor_kgCO2_per_MJ": 0.0021
#     }


url = "http://127.0.0.1:5000/graphs"

data = {"sample": sample_data}

try:
    response = requests.post(url, json=data)
    print("Status Code:", response.status_code)
    print("Response Text:", response.text)
    print("Response JSON:", response.json())
except requests.exceptions.ConnectionError:
    print("Connection failed! Make sure the Flask server is running on 127.0.0.1:5000")
except Exception as e:
    print("Some other error:", e)








# # Example usage
# sample_x = {
#     "R_10": 121.6720541, "R_8": 109.3592131, "R_6": 90.47141056,
#     "G_10": 124.4515316, "G_8": 123.0957019, "G_6": 112.5941138,
#     "B_10": 17.29242693, "B_8": 21.56303304, "B_6": 25.67999868
# }

# url = "http://127.0.0.1:5000/predict_spectroscopy"

# data = {"specta": sample_x}  # use sample_x here

# try:
#     response = requests.post(url, json=data)
#     print("Status Code:", response.status_code)
#     print("Response Text:", response.text)
#     print("Response JSON:", response.json())
# except requests.exceptions.ConnectionError:
#     print("Connection failed! Make sure the Flask server is running on 127.0.0.1:5000")
# except Exception as e:
#     print("Some other error:", e)
