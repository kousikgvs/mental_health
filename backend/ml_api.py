# api.py
import os
import pickle
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scipy.special import expit  # sigmoid

# -------------------------------------------------
# CONFIG – point this at your .pkl folder
SAVE_DIR = r"C:\Users\kousi\Documents\hackathon\ml_pkl"

# -------------------------------------------------
def load_pickle(name: str):
    path = os.path.join(SAVE_DIR, name)
    try:
        with open(path, "rb") as f:
            return pickle.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail=f"Missing file: {name}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Load error ({name}): {e}")

le_course = load_pickle("le_course.pkl")
le_study  = load_pickle("le_study.pkl")
le_cgpa   = load_pickle("le_cgpa.pkl")
scaler    = load_pickle("scaler.pkl")
log_reg   = load_pickle("logistic_regression.pkl")
svm       = load_pickle("svm_model.pkl")
rf        = load_pickle("random_forest.pkl")

# -------------------------------------------------
app_5 = FastAPI(title="Mental Health Prediction API")
app_5.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
class SurveyInput(BaseModel):
    gender: str          # "Male" / "Female"
    age: int
    course: str
    year_of_study: str   # e.g. "Year 1"
    cgpa: str
    marital_status: str  # "Yes"/"No"
    depression: str      # "Yes"/"No"
    anxiety: str         # "Yes"/"No"
    panic_attack: str    # "Yes"/"No"

# -------------------------------------------------
def _normalize(value: str, encoder) -> int:
    """
    Normalise a categorical value for a given LabelEncoder.
    Returns the integer code.
    """
    v = value.strip()
    # 1. exact match after upper-casing
    if v.upper() in (c.upper() for c in encoder.classes_):
        return encoder.transform([v])[0]

    # 2. case-insensitive partial match (first hit)
    for cls in encoder.classes_:
        if v.lower() in cls.lower():
            return encoder.transform([cls])[0]

    # 3. nothing found → helpful 400
    known = sorted(set(encoder.classes_), key=str.lower)
    raise HTTPException(
        status_code=400,
        detail=f"Unknown value '{value}'. Known: {known}"
    )

# -------------------------------------------------
def get_probability(model, X):
    """Safe probability extraction (predict_proba → decision_function → sigmoid)."""
    if hasattr(model, "predict_proba"):
        return model.predict_proba(X)[0][1]
    if hasattr(model, "decision_function"):
        return float(expit(model.decision_function(X)[0]))
    raise ValueError(f"Model {type(model).__name__} has no probability method")

# -------------------------------------------------
def prepare_features(p: SurveyInput):
    gender = 1 if p.gender == "Male" else 0
    marital = 1 if p.marital_status == "Yes" else 0
    dep = 1 if p.depression == "Yes" else 0
    anx = 1 if p.anxiety == "Yes" else 0
    pan = 1 if p.panic_attack == "Yes" else 0

    course_enc = _normalize(p.course, le_course)
    year_enc   = _normalize(p.year_of_study, le_study)
    cgpa_enc   = _normalize(p.cgpa, le_cgpa)

    row = [[gender, p.age, course_enc, year_enc, cgpa_enc,
            marital, dep, anx, pan]]

    return scaler.transform(row)

# -------------------------------------------------
@app_5.post("/predict")
def predict(p: SurveyInput):
    try:
        X = prepare_features(p)

        lr_prob = get_probability(log_reg, X)
        svm_prob = get_probability(svm, X)
        rf_prob  = get_probability(rf, X)

        ens_prob = (lr_prob + svm_prob + rf_prob) / 3.0
        ens_pred = 1 if ens_prob >= 0.5 else 0

        return {
            "ensemble_prediction": int(ens_pred),
            "ensemble_probability": float(ens_prob),
            "model_probs": {
                "logistic_regression": float(lr_prob),
                "svm": float(svm_prob),
                "random_forest": float(rf_prob),
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")