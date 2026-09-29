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
    #Drop NULL data
    df = df.dropna(subset=FEATURES + [TARGET])
    return df[FEATURES], df[TARGET]


def build_pipeline():
    encoder = ColumnTransformer(
        #Categorize suburbs into number (e.g Randwick => 1, Chatswood => 2)
        transformers=[
            ("suburb", OneHotEncoder(handle_unknown="ignore"), ["Suburb"]),
        ],
        # Bedroom2 and Bathroom are already numbers, so pass them straight on.
        remainder="passthrough",
    )
    return Pipeline([("encode", encoder), ("model", LinearRegression())])


def main():
    X, y = load_data()
    # Hold back 20% of rows so we score the model on sales it never saw.
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    pipeline = build_pipeline()
    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)
    MODEL_PATH.parent.mkdir(exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Saved -> {MODEL_PATH}")

    save_price_range(y_test.to_numpy(), predictions)


def save_price_range(actual, predictions):
    #Record bracket changes
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


if __name__ == "__main__":
    main()
