from flask import Blueprint, jsonify, request

from . import predictor

bp = Blueprint("api", __name__)


@bp.get("/suburbs")
def suburbs():
    return jsonify({"suburbs": predictor.KNOWN_SUBURBS})


@bp.post("/predict")
def predict():
    body = request.get_json(silent=True) or {}
    
    if not body:
        return jsonify({"error":"Unknown body"}),400

    suburb = body.get("suburb")
    if suburb not in predictor.KNOWN_SUBURBS:
        return jsonify({"error": f"Unknown suburb: {suburb!r}"}), 400

    try:
        bedrooms = int(body["bedrooms"])
        bathrooms = int(body["bathrooms"])
    except (KeyError, TypeError, ValueError):
        return jsonify({"error": "bedrooms and bathrooms must be integers"}), 400

    price, low, high = predictor.predict(suburb, bedrooms, bathrooms) # type: ignore
    return jsonify(
        {
            "price": round(price),
            "min": round(low),
            "max": round(high),
            "suburb": suburb,
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
        }
    )
