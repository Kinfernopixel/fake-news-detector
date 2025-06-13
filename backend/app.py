from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

classifier = pipeline("text-classification", model="mrm8488/bert-tiny-finetuned-fake-news")

@app.route('/')
def home():
    return "Fake News Detector API is running."

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400
    result = classifier(text)[0]
    label = result["label"]
    score = float(result["score"])
    reasoning = f"This article is predicted as {label} with a confidence score of {score:.2f}."
    return jsonify({
        "prediction": label,
        "confidence": score,
        "reasoning": reasoning
    })

if __name__ == '__main__':
    app.run(debug=True)
