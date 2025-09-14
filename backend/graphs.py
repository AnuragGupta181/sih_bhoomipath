import pandas as pd
import numpy as np
import matplotlib
matplotlib.use("Agg")   # non-GUI backend (no window)

import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
import os


def to_call():
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    plt.close()
    return base64.b64encode(buf.getvalue()).decode("utf-8")

def graphs(sample_data):
    charts=[]
    data=pd.DataFrame([sample_data])
    
    # chart 1
    plt.figure(figsize=(12,6))
    plt.title("Emissions Breakdown")

    sns.barplot(data[['Energy_MJ_per_kg','Transport_emissions_kgCO2','Process_emissions_kgCO2','Emission_factor_kgCO2_per_MJ','Total_emissions_kgCO2']])
    plt.xticks(rotation=45)
    plt.ylabel("Kg")
    
    charts.append(to_call())




    # chart 2
    values=data[['Energy_MJ_per_kg','Transport_emissions_kgCO2','Process_emissions_kgCO2','Emission_factor_kgCO2_per_MJ','Total_emissions_kgCO2']].iloc[0]
    labels=values.index

    plt.figure(figsize=(8,8))
    plt.pie(values, labels=labels, autopct='%1.1f%%', startangle=90)
    plt.title("Emissions Breakdown")
    
    charts.append(to_call())



    # chart 3
    plt.figure(figsize=(12,6))
    plt.title("Emissions Breakdown")

    sns.barplot(x="Quantity_kg", y="Water_use_m3_per_ton", data=data, color="skyblue", label="Water use")

    plt.legend()
    plt.xticks(rotation=45)
    
    charts.append(to_call())




    # chart 4
    
    fig, ax = plt.subplots()

    data[["Energy_MJ_total", "Total_emissions_kgCO2"]].plot(kind="bar", ax=ax)

    
    charts.append(to_call())


    # chart 5
    fig, ax = plt.subplots()

    data[["Energy_MJ_total", "Total_emissions_kgCO2"]].iloc[0].plot.pie(autopct='%1.1f%%', ax=ax)

    
    charts.append(to_call())

    return charts



if __name__=="__main__":
    sample_data = {
    "Process_Type": "Primary",
    "Metal": "Aluminium",
    "Energy_MJ_per_kg": 210.5,
    "Quantity_kg": 100,
    "Energy_MJ_total": 21050.0,
    "Transport_km": 150.0,
    "Transport_Mode": "Truck",
    "Transport_emissions_kgCO2": 45.7,
    "Water_use_m3_per_ton": 6.8,
    "End_of_Life": "Recycle",
    "Circularity_option": "Closed-loop",
    "Process_emissions_kgCO2": 520.3,
    "Total_emissions_kgCO2": 566.0,
    "Emission_factor_kgCO2_per_MJ": 0.0021,
    }
    charts=graphs(sample_data=sample_data)

    folder_path="charts"
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    for i in range(len(charts)):    
        with open(f"{folder_path}/chart{i}.png", "wb") as f:
            f.write(base64.b64decode(charts[i]))
            print(f"Image saved as chart{i}.png")

