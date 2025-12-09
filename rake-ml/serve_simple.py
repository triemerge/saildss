from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI()
model = joblib.load("models/simple_order_model.joblib")

class OrderIn(BaseModel):
    customer: str
    product: str
    quantity: float
    destination: str
    priority: str
    mode: str
    deadline: str

@app.post("/predict")
def predict(order: OrderIn):
    df = pd.DataFrame([order.dict()])
    df["deadline"] = pd.to_datetime(df["deadline"])
    df["days_to_deadline"] = (df["deadline"] - pd.Timestamp.today()).dt.days.clip(-30, 365)

    X = df[["customer","product","quantity","destination","priority","mode","days_to_deadline"]]
    proba = model.predict_proba(X)[0][1]

    return {
        "on_time_probability": float(proba),
        "delay_probability": float(1 - proba),
        "recommendation": "Urgent" if (1-proba) > 0.6 else "Normal"
    }
