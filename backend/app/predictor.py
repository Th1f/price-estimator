"""Loads the trained pipeline and turns inputs into a price."""

import bisect
import json
from pathlib import Path

import joblib
import pandas as pd


#Checking if path exists
MODEL_PATH = Path(__file__).parent.parent / "models" / "model.joblib"
if not MODEL_PATH.exists():
    raise RuntimeError(f"No model at {MODEL_PATH}. Run `python train.py` first.")


_pipeline = joblib.load(MODEL_PATH)

RANGE_PATH = MODEL_PATH.parent / "price_range.json"
if not RANGE_PATH.exists():
    raise RuntimeError(f"No price range at {RANGE_PATH}. Run `python train.py` first.")
_range = json.loads(RANGE_PATH.read_text())

#Extract all suburbs used in the model
KNOWN_SUBURBS = sorted(
    _pipeline.named_steps["encode"].named_transformers_["suburb"].categories_[0]
)



def predict(suburb: str, bedrooms: int, bathrooms: int) -> tuple[float, float, float]:
    row = pd.DataFrame(
        [{"Suburb": suburb, "Bedroom2": bedrooms, "Bathroom": bathrooms}]
    )
    price = float(_pipeline.predict(row)[0])

    # Look up the error range for this price's bracket.
    bracket = _range["brackets"][bisect.bisect_right(_range["edges"], price)]
    low = price + bracket["below"]
    high = price + bracket["above"]
    return price, low, high
