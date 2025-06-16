from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

@app.route('/')
def home():
    return "Fake News Detector API is running."

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Zero-shot: Candidate labels are REAL and FAKE
    result = classifier(
        text,
        candidate_labels=["REAL", "FAKE"],
        hypothesis_template="This article is {} news."
    )

    prediction = result['labels'][0]
    confidence = float(result['scores'][0])
    reasoning = (
        f"The model predicts this article is '{prediction}' "
        f"(confidence: {confidence:.2f})."
    )

    return jsonify({
        "prediction": prediction,
        "confidence": confidence,
        "reasoning": reasoning
    })

if __name__ == '__main__':
    app.run(debug=True)
