# Price Estimator

Estimates a house price from its suburb, bedrooms and bathrooms. The backend is a Flask API that serves a scikit-learn model, and the frontend is a React + Vite app that calls it.

```
backend/    Flask API, training script and dataset
frontend/   React + Vite + Tailwind app
```

## 1. Backend

From the `backend/` folder:

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Train the model (writes models/model.joblib and models/price_range.json)
python train.py

# Start the API on http://127.0.0.1:5000
flask --app app run
```

You only need to run `train.py` once, and again whenever the dataset or training code changes. The API won't start without the model files it produces.

To check that the API is running, open http://127.0.0.1:5000/suburbs. It should return a JSON list of suburbs.

## 2. Frontend

In a second terminal, from the `frontend/` folder:

```bash
cd frontend
npm install
npm run dev
```

Then open the URL Vite prints, usually http://localhost:5173.

The frontend sends requests to `http://127.0.0.1:5000`, which is set in `frontend/src/api/client.ts`. Keep the backend running on that port, or change the URL there.

## API

| Method | Path       | Body                                                  | Returns                                   |
| ------ | ---------- | ----------------------------------------------------- | ----------------------------------------- |
| GET    | `/suburbs` | none                                                  | `{ "suburbs": [...] }`                    |
| POST   | `/predict` | `{ "suburb": "...", "bedrooms": 3, "bathrooms": 2 }`  | `{ "price", "min", "max", "suburb", ... }` |
