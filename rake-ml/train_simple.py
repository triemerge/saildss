# train_simple.py
"""
Train a simple ML model to predict if an order will be delivered on time.
Outputs:
 - models/simple_order_model.joblib
 - output/metrics.json
 - output/test_predictions.csv
"""

import os
import json
import joblib
import pandas as pd
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

DATA_PATH = "data/simple_orders.csv"
MODEL_DIR = "models"
OUT_DIR = "output"

def ensure_dirs():
    os.makedirs(MODEL_DIR, exist_ok=True)
    os.makedirs(OUT_DIR, exist_ok=True)

def load_data():
    df = pd.read_csv(DATA_PATH, low_memory=False)
    df["deadline"] = pd.to_datetime(df["deadline"], errors="coerce")
    return df

def main():
    ensure_dirs()
    
    print("Loading data...")
    df = load_data()
    print("Rows:", len(df))

    # Compute days to deadline
    today = pd.Timestamp.today().normalize()
    df["days_to_deadline"] = (df["deadline"] - today).dt.days.clip(-30, 365).fillna(9999)
    df["quantity"] = pd.to_numeric(df["quantity"], errors="ignore").fillna(0)

    FEATURES = ["customer","product","quantity","destination","priority","mode","days_to_deadline"]
    TARGET = "delivered_on_time"

    X = df[FEATURES]
    y = df[TARGET].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    cat_cols = ["customer","product","destination","priority","mode"]
    num_cols = ["quantity","days_to_deadline"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse=False), cat_cols),
            ("num", "passthrough", num_cols)
        ]
    )

    model = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(n_estimators=200, random_state=42))
    ])

    print("Training model...")
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    proba = model.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, preds)
    report = classification_report(y_test, preds, output_dict=True)
    cm = confusion_matrix(y_test, preds).tolist()

    # Save model
    joblib.dump(model, f"{MODEL_DIR}/simple_order_model.joblib")
    print("Model saved to models/simple_order_model.joblib")

    # Save predictions
    test_df = X_test.copy()
    test_df["true"] = y_test.values
    test_df["pred"] = preds
    test_df["proba_on_time"] = proba
    test_df["delay_probability"] = 1 - proba
    test_df.to_csv(f"{OUT_DIR}/test_predictions.csv", index=False)

    # Save metrics
    metrics = {
        "accuracy": acc,
        "classification_report": report,
        "confusion_matrix": cm,
    }
    with open(f"{OUT_DIR}/metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)

    print("Training complete.")
    print("Accuracy:", acc)

if __name__ == "__main__":
    main()
