from distutils.command.clean import clean
import pandas as pd
data = pd.read_excel("../data/Food_Insecurity_Projections/VLFScounties.xlsx", sheet_name=1)
# print(data)
cleaned_data = data[["FIPS", "2020_VLFS_Percent_Mar2021"]]
cleaned_data = cleaned_data.rename(columns={"2020_VLFS_Percent_Mar2021":"VLFS"})
relative_max = max(cleaned_data["VLFS"])

cleaned_data["HEAT"] = cleaned_data["VLFS"] / relative_max
print(cleaned_data)
# print(cleaned_data)
# # FIR = Food Insecurity Rate

cleaned_data.to_json("../data/processed/2020_food_insecurity.json", orient="records")

data_manufacturers = pd.read_excel("../data/FoodProcess.xlsx")
# print(data)
# print(cleaned_data)
# # FIR = Food Insecurity Rate

data_manufacturers.to_json("../data/processed/food_manufacturers.json", orient="records")


# FIPS, VLFS, HUE