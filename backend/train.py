"""Fit the price model and save it to models/model.joblib.

Run manually whenever the dataset changes:
    python train.py
"""

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

BASE_DIR = Path(__file__).parent
DATASET = BASE_DIR / "dataset" / "house_dataset.csv"
MODEL_PATH = BASE_DIR / "models" / "model.joblib"
RANGE_PATH = BASE_DIR / "models" / "price_range.json"

FEATURES = ["Suburb", "Bedroom2", "Bathroom"]
TARGET = "Price"


def load_data():
    df = pd.read_csv(DATASET)
    # A row with no price teaches the model nothing; a row with no bedroom
    # count can't be fed to it. Drop both.
    df = df.dropna(subset=FEATURES + [TARGET])
    return df[FEATURES], df[TARGET]


def build_pipeline():
    encoder = ColumnTransformer(
        transformers=[
            # handle_unknown="ignore" stops a suburb the model has never seen
            # from crashing the API at predict time.
            ("suburb", OneHotEncoder(handle_unknown="ignore"), ["Suburb"]),
        ],
        # Bedroom2 and Bathroom are already numbers, so pass them straight on.
        remainder="passthrough",
    )
    return Pipeline([("encode", encoder), ("model", LinearRegression())])


def main():
    X, y = load_data()
    print(f"Training on {len(X)} rows, {X['Suburb'].nunique()} suburbs")

    # Hold back 20% of rows so we score the model on sales it never saw.
    # Scoring on the training rows would flatter it and tell us nothing.
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    pipeline = build_pipeline()
    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)
    print(f"R^2 : {r2_score(y_test, predictions):.3f}")
    print(f"MAE : ${mean_absolute_error(y_test, predictions):,.0f}")

    MODEL_PATH.parent.mkdir(exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Saved -> {MODEL_PATH}")

    save_price_range(y_test.to_numpy(), predictions)


def save_price_range(actual, predictions):
    """Record how far off the model was on the test rows, per price bracket.

    Errors grow with price, so one flat +/- would be too wide for cheap houses
    and too narrow for expensive ones. Instead, split predictions into four
    brackets and keep the 10th-90th percentile of the misses in each: the real
    price lands inside that range about 80% of the time.
    """
    misses = actual - predictions
    edges = np.quantile(predictions, [0.25, 0.5, 0.75])
    bracket = np.digitize(predictions, edges)
    brackets = [
        {
            "below": float(np.quantile(misses[bracket == b], 0.10)),
            "above": float(np.quantile(misses[bracket == b], 0.90)),
        }
        for b in range(len(edges) + 1)
    ]
    RANGE_PATH.write_text(json.dumps({"edges": edges.tolist(), "brackets": brackets}, indent=2))
    print(f"Saved -> {RANGE_PATH}")


if __name__ == "__main__":
    main()
