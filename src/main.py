import pandas as pd
data = pd.read_excel("../data/Map_the_Meal_Gap_Data/MMG2021_2019Data_ToShare.xlsx", sheet_name=1)
cleaned_data = data[["FIPS", "2019 Food Insecurity Rate"]]

cleaned_data = cleaned_data.rename(columns={"2019 Food Insecurity Rate":"FIR"})
# FIR = Food Insecurity Rate
cleaned_data.to_json("../data/processed/2019_food_insecurity.json", orient="records")
