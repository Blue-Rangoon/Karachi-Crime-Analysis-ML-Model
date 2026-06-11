import pandas as pd
import numpy as np
from flask import Flask, jsonify, request
import requests
from dotenv import load_dotenv
import os
import joblib

import os, gdown, joblib

MODEL_PATH = 'crime_model.joblib'
DRIVE_URL = 'https://drive.google.com/uc?id=1buzlPuWSRlsPGffcezYgFCzRgaZLi-c1&export=download'

if not os.path.exists(MODEL_PATH):
    print("Downloading 354MB model from Google Drive...")
    gdown.download(DRIVE_URL, MODEL_PATH, quiet=False)

model = joblib.load(MODEL_PATH)
print("Model loaded successfully!")


# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder=".", static_url_path="")

# Load model and encoders
try:
    models = {
        "Random Forest": joblib.load("random_forest_model.joblib"),
        "Decision Tree": joblib.load("decision_tree_model.joblib"),
        "Logistic Regression": joblib.load("logistic_model.joblib")
    }
    encoders = joblib.load("model_encoders.joblib")
    print("All models and encoders loaded successfully!")
except Exception as e:
    print(f"Error loading models/encoders: {e}")
    models = {}
    encoders = None

CURRENTS_API_KEY = os.getenv("CURRENTS_API_KEY")

@app.after_request
def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

@app.route("/")
def index():
    return app.send_static_file("index.html")

@app.route("/dashboard.html")
def dashboard():
    return app.send_static_file("dashboard.html")

@app.route("/api/features")
def get_features():
    if not encoders:
        return jsonify({"error": "Model encoders not loaded on backend"}), 500
    
    features = {}
    for col, le in encoders.items():
        classes = list(le.classes_)
        if col == 'Suspect_Gender' and 'Female' not in classes:
            classes.append('Female')
        features[col] = sorted(classes)
        
    return jsonify(features)

@app.route("/api/predict", methods=["POST"])
def predict():
    if not models or not encoders:
        return jsonify({"error": "Models or encoders not loaded on backend"}), 500
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON payload provided"}), 400
            
        model_name = data.get("Model", "Random Forest")
        if model_name not in models:
            return jsonify({"error": f"Invalid model choice: {model_name}"}), 400
        model = models[model_name]
        
        required_fields = [
            'Month', 'Karachi Area', 'Crime Count', 
            'Suspect_Age', 'Suspect_Gender', 
            'Occupation', 'Education_Level', 'Crime_Motive'
        ]
        
        # Check if fields are present
        for f in required_fields:
            if f not in data:
                return jsonify({"error": f"Missing field: {f}"}), 400
                
        # Encode values
        encoded_data = {}
        for col in required_fields:
            val = str(data[col])
            if col == 'Crime Count':
                try:
                    encoded_data[col] = float(val)
                except ValueError:
                    encoded_data[col] = 1.0
            else:
                le = encoders[col]
                # Fallback if value not in classes
                if val not in le.classes_:
                    if 'Unknown' in le.classes_:
                        val = 'Unknown'
                    else:
                        val = le.classes_[0]
                encoded_data[col] = le.transform([val])[0]
                
        # construct feature DataFrame matching order of X's columns
        input_df = pd.DataFrame([[encoded_data[f] for f in required_fields]], columns=required_fields)
        
        # Predict probability
        probabilities = model.predict_proba(input_df)[0]
        classes = model.classes_
        
        # Combine classes and probabilities
        class_probs = list(zip(classes, probabilities))
        class_probs.sort(key=lambda x: x[1], reverse=True)
        
        # Format the top predictions
        top_prediction = class_probs[0][0]
        top_confidence = float(class_probs[0][1] * 100)
        
        predictions_list = []
        for c, p in class_probs[:5]:
            predictions_list.append({
                "category": c,
                "probability": float(p)
            })
            
        risk_score = int(top_confidence)
        
        # Classify risk level based on crime type severity
        severity_map = {
            'ROBBERY': 'High',
            'ASSAULT': 'High',
            'HOMICIDE': 'High',
            'KIDNAPPING': 'High',
            'RAPE': 'High',
            'WEAPON': 'High',
            'BURGLARY': 'Moderate',
            'THEFT': 'Moderate',
            'FRAUD': 'Low',
            'VANDALISM': 'Low',
            'FORGERY': 'Low'
        }
        
        top_pred_upper = top_prediction.upper()
        severity = 'Moderate'
        for key, val in severity_map.items():
            if key in top_pred_upper:
                severity = val
                break
                
        return jsonify({
            "prediction": top_prediction,
            "confidence": round(top_confidence, 2),
            "risk_score": risk_score,
            "risk_level": severity,
            "top_predictions": predictions_list
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/news")
def get_news():
    try:
        url = "https://api.currentsapi.services/v1/search"

        params = {
            "apiKey": CURRENTS_API_KEY,
            "keywords": "Karachi crime",
            "language": "en"
        }

        response = requests.get(url, params=params)
        
        if response.status_code != 200:
            return jsonify({
                "error": f"Currents API responded with status {response.status_code}"
            }), response.status_code

        data = response.json()
        articles = []

        for article in data.get("news", [])[:10]:
            articles.append({
                "title": article.get("title", "No Title"),
                "description": article.get("description", "No Description"),
                "url": article.get("url", "#"),
                "image": article.get("image", ""),
                "published": article.get("published", "")
            })

        return jsonify(articles)

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)