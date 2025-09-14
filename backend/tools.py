from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage
from app import modelPred
from dotenv import load_dotenv
import os
load_dotenv()


def predictLca(input_data):
    return modelPred(input_data)



GROQ_API_KEY=os.getenv('GROQ_API_KEY')
llm = ChatGroq(model="llama-3.1-8b-instant", api_key=GROQ_API_KEY)

# lca_prompt = PromptTemplate(
#     template="""
# You are an LCA Insights Expert for companies. You are NOT explaining what LCA is. 
# You are ONLY providing actionable, data-driven insights and recommendations based on the company's input data. 
# Your goal is to help the company **reduce GHG emissions, optimize resource use, and save costs**.

# Use the following data:

# {sample_row}

# Instructions:

# 1. Calculate total GHG emissions, energy consumption, water use, and any other relevant metrics.
# 2. Highlight any inconsistencies in the data if present.
# 3. Provide specific suggestions for improvement, for example:
#    - Using alternative transport (truck → rail) and estimating possible cost or emission savings.
#    - Optimizing energy efficiency.
#    - Recycling strategies or circularity improvements.
# 4. Provide a concise summary table of key metrics at the top.
# 5. Give recommendations in numbered actionable points.

# Respond in a professional, business-oriented style.

# Question:
# {question}

# Answer:
# """,
#     input_variables=["sample_row", "question"]
# )



lca_prompt = PromptTemplate(
    template="""
You are an LCA (Life Cycle Assessment) Insights Expert. 
You are NOT explaining what LCA is. 
You are ONLY providing **step-by-step actionable, data-driven insights** based on the company's input data.

Your task:
- Identify environmental issues (on nature) and human health issues at every stage 
  (Raw Material Extraction → Processing → Transport → Usage → End-of-Life/Disposal).
- Quantify emissions, resource use, and potential risks using formulas.
- Suggest improvements with **clear estimated % savings in GHG emissions, cost, or resource use**.

Use the following company data:

{sample_row}

---

📊 **Formulas to Use:**
- GHG emissions (kg CO₂e) = Activity Data × Emission Factor  
- Energy Use (MJ) = Fuel Consumption × Energy Factor  
- Water Use (L) = Process Water Consumption × Scaling Factor  
- % Savings = (Baseline – Improved) ÷ Baseline × 100  
- Cost Savings = (Old Cost – New Cost) ÷ Old Cost × 100  

---

### Instructions:

1. **Summary Table (Top Section)**  
   Include:  
   - Total GHG emissions (kg CO₂e)  
   - Total Energy consumption (MJ)  
   - Water use (L)  
   - Waste generated (kg)  
   - Health impact indicators (air pollution, toxicity, etc.)  

2. **Step-by-Step Breakdown** (Raw Material → Processing → Transport → Use → End-of-Life):  
   - Environmental impacts (climate, biodiversity, pollution).  
   - Human health impacts (air quality, toxic exposure, disease risks).  
   - Show formulas used for each key calculation.  
   - Highlight any data inconsistencies.  

3. **Improvement Recommendations with Quantification:**  
   - Transport shift (truck → rail, or truck → EV) with estimated % GHG savings.  
   - Energy efficiency or renewable energy adoption with % savings.  
   - Material substitution or recycling strategies with % savings.  
   - Circular economy or reuse practices.  

4. **Final Output Format:**  
   - Start with a summary table.  
   - Then give stage-wise environmental & health issues with calculations.  
   - End with **numbered actionable recommendations** with % savings and cost benefits.  

Question:  
{question}  

Answer:
""",
    input_variables=["sample_row", "question"]
)

def lca_chat(sample_row, question):
    
    prompt_text = lca_prompt.format(sample_row=sample_row, question=question)
    messages = [HumanMessage(content=prompt_text)]
    response = llm.invoke(messages)
    return response.content

if __name__ == "__main__":
    sample_row = {
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

    print("Welcome to the LCA Chatbot!")
    sample_row = predictLca(sample_row)
    while True:
        user_question = input("\nEnter your LCA question (or 'exit' to quit): ")
        if user_question.lower() == "exit":
            break
        answer = lca_chat(sample_row, user_question)
        print("\nLCA Report:\n", answer)
