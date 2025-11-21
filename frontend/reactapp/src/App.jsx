import { useState } from "react";
import axios from "axios";

export default function App() {
  const [pdf, setPdf] = useState(null);
  const [rules, setRules] = useState(["", "", ""]);
  const [results, setResults] = useState([]);

  const uploadPdf = (e) => setPdf(e.target.files[0]);

  const updateRule = (i, value) => {
    const copy = [...rules];
    copy[i] = value;
    setRules(copy);
  };

  const checkDoc = async () => {
    const form = new FormData();
    form.append("pdf", pdf);
    form.append("rules", JSON.stringify(rules));

    const res = await axios.post("http://localhost:5000/check", form);
    setResults(res.data.results);
  };

  return (
    <div
      style={{
        background: "#121212",
        color: "white",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <h1>PDF Rule Checker</h1>

      <input type="file" accept="application/pdf" onChange={uploadPdf} />

      <div style={{ marginTop: "20px" }}>
        {rules.map((r, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Rule ${i + 1}`}
            value={r}
            onChange={(e) => updateRule(i, e.target.value)}
            style={{
              display: "block",
              margin: "10px 0",
              padding: "8px",
              width: "300px",
            }}
          />
        ))}
      </div>

      <button
        onClick={checkDoc}
        style={{
          marginTop: "20px",
          padding: "10px",
          background: "#333",
          color: "white",
        }}
      >
        Check Document
      </button>

      {results.length > 0 && (
        <table
          style={{
            marginTop: "30px",
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Rule</th>
              <th>Status</th>
              <th>Evidence</th>
              <th>Reasoning</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td>{r.rule}</td>
                <td>{r.status}</td>
                <td>{r.evidence}</td>
                <td>{r.reasoning}</td>
                <td>{r.confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
