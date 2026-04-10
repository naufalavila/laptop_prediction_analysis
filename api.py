'''
Purpose of this file:
Accepts inputs from web -> make predictions -> Sends back the prediction to user
'''
# api.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np

app = FastAPI()

# CORS: biar React frontend bisa akses
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ganti ["http://localhost:5173"] kalau sudah production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model & encoder (sekali saja saat startup)
model = joblib.load("model.pkl")
encoder = joblib.load("encoder.pkl")

# Urutan kolom HARUS sama persis seperti saat training
NUM_COLS = ['RAM_GB', 'Screen_Size', 'Storage_GB', 'Weight_KG']
CAT_COLS = ['Category', 'OS', 'CPU_Tier', 'GPU_Type']
# Simpan nama kolom hasil encoding dari training (penting!)
ENCODED_FEATURE_NAMES = None  # Akan diisi setelah pertama kali predict

class LaptopInput(BaseModel):
    Category: str
    OS: str
    CPU_Tier: str
    GPU_Type: str
    RAM_GB: float
    Screen_Size: float
    Storage_GB: float
    Weight_KG: float

@app.post("/predict")
def predict(data: LaptopInput):
    global ENCODED_FEATURE_NAMES
    
    # 1. Buat DataFrame dari input
    df_in = pd.DataFrame([data.dict()])
    
    # 2. Encode kategori pakai encoder yang sudah di-save
    cat_encoded = encoder.transform(df_in[CAT_COLS])
    cat_df = pd.DataFrame(cat_encoded, columns=encoder.get_feature_names_out(CAT_COLS))
    
    # 3. Gabung numeric + encoded categorical
    num_df = df_in[NUM_COLS].reset_index(drop=True)
    x_input = pd.concat([num_df, cat_df], axis=1)
    
    # 4. Simpan & align kolom (pertama kali jalan)
    if ENCODED_FEATURE_NAMES is None:
        ENCODED_FEATURE_NAMES = x_input.columns.tolist()
    
    # 5. Pastikan urutan kolom sama (isi 0 untuk kolom yang tidak ada)
    x_input = x_input.reindex(columns=ENCODED_FEATURE_NAMES, fill_value=0)
    
    # 6. Predict
    pred = model.predict(x_input)[0]
    
    return {"predicted_price": round(float(pred), 2)}

@app.get("/")
def root():
    return {"message": "API Laptop Predictor is running. Visit /docs for testing."}