import { useState } from "react";

function getBadgeColor(prediction) {
  if (prediction === "REAL") return "#19c37d";
  if (prediction === "FAKE") return "#e55353";
  return "#888";
}

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await fetch("http://127.0.0.1:5000/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div
  style={{
    minHeight: "100vh",
    minWidth: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(ellipse 120% 80% at 60% 35%, #a7ffeb11 0%, #1e293b 70%), radial-gradient(ellipse 60% 40% at 20% 80%, #7dd3fc22 0%, #18181b 80%), linear-gradient(135deg,#22223b 0%, #18181b 100%)",
    transition: "background 0.5s",
    animation: "bgmove 8s linear infinite alternate",
  }}
>
  <style>
    {`
      @keyframes bgmove {
        0% {
          background-position: 60% 40%, 10% 90%;
        }
        100% {
          background-position: 65% 25%, 30% 85%;
        }
      }
    `}
     </style>
      <div
        style={{
          background: "#18181b",
          borderRadius: 16,
          boxShadow: "0 2px 32px 4px #000a",
          maxWidth: 450,
          width: "100%",
          padding: "2.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <h2 style={{ color: "#fff", fontWeight: 700, textAlign: "center", margin: 0, fontSize: "2rem", letterSpacing: "-0.5px" }}>
          📰 Fake News Detector
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <textarea
            rows={7}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste news article here..."
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 8,
              fontSize: 16,
              border: "1px solid #333",
              background: "#232329",
              color: "#fff",
              resize: "vertical",
              outline: "none",
              fontFamily: "inherit",
            }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              borderRadius: 8,
              background: loading ? "#444" : "linear-gradient(90deg, #6ee7b7 0%, #3b82f6 100%)",
              color: "#18181b",
              fontWeight: 700,
              fontSize: 17,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 2px 12px #0006",
              transition: "all 0.2s"
            }}
          >
            {loading ? "Analyzing..." : "Check News"}
          </button>
        </form>
        {result && (
          <div
            style={{
              background: "#232329",
              borderRadius: 10,
              padding: "1rem",
              color: "#fff",
              marginTop: 8,
              boxShadow: "0 0px 10px #0003"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "5px 15px",
                  borderRadius: 16,
                  background: getBadgeColor(result.prediction),
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 17,
                  letterSpacing: "1px"
                }}
              >
                {result.prediction}
              </span>
              <span style={{ color: "#aaa", fontSize: 14 }}>
                Confidence: <b>{(result.confidence * 100).toFixed(2)}%</b>
              </span>
            </div>
            <p style={{ color: "#f3f3f3", fontSize: 16, margin: 0 }}>
              {result.reasoning}
            </p>
          </div>
        )}
        <footer style={{ fontSize: 13, color: "#aaa", textAlign: "center", marginTop: 10 }}>
          <span>Made by Kanan Shah, using AI and NLP | <a href="https://huggingface.co/models" style={{ color: "#3b82f6" }} target="_blank" rel="noopener noreferrer">HuggingFace</a></span>
        </footer>
      </div>
    </div>
  );
}

export default App;
