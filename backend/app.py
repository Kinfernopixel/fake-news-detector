from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

classifier = pipeline("text-classification", model="microsoft/deberta-base-mnli")

@app.route('/')
def home():
    return "Fake News Detector API is running."

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Use NLI: Premise = input text, Hypothesis = "This article is real news."
    result = classifier({
        "premise": text,
        "hypothesis": "This article is real news."
    })[0]

    label = result["label"]  # 'ENTAILMENT', 'NEUTRAL', or 'CONTRADICTION'
    score = float(result["score"])
    if label == "ENTAILMENT":
        prediction = "REAL"
    elif label == "CONTRADICTION":
        prediction = "FAKE"
    else:
        prediction = "UNCERTAIN"

    reasoning = (
        f"The model predicts this article is '{prediction}' "
        f"(NLI label: {label}, confidence: {score:.2f})."
    )

    return jsonify({
        "prediction": prediction,
        "confidence": score,
        "reasoning": reasoning
    })

if __name__ == '__main__':
    app.run(debug=True)
