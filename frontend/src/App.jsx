import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await fetch("http://localhost:5000/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: 600, margin: "auto", padding: 24 }}>
      <h2>Fake News Detector</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={8}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste news article here..."
          style={{ width: "100%", marginBottom: 12 }}
          required
        />
        <button type="submit" disabled={loading}>{loading ? "Analyzing..." : "Check News"}</button>
      </form>
      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Prediction: {result.prediction}</h3>
          <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
          <p>{result.reasoning}</p>
        </div>
      )}
    </div>
  );
}
