import pandas as pd

# Load dataset dari PKL atau CSV
df = pd.read_pickle("recipe_vectors.pkl")   # kalau dari PKL
# df = pd.read_csv("recipe_vectors.csv")    # kalau dari CSV

# Convert ke JSON
df.to_json("recipe_vectors.json", orient="records")

print("Dataset berhasil dikonversi ke recipe_vectors.json")
