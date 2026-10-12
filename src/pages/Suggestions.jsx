import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Suggestions() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [suggestion, setSuggestion] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (!suggestion.trim()) {
      setMessage("Please enter your suggestion.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "http://https://food-ordering-5v9t.onrender.com/api/suggestions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            user_name: user.name,
            user_email: user.email,
            suggestion: suggestion.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to submit suggestion."
        );
        return;
      }

      setSuggestion("");
      setMessage(
        "Thank you! Your suggestion has been submitted successfully. 💬"
      );
    } catch (error) {
      console.error(
        "Suggestion submit error:",
        error
      );

      setMessage(
        "Unable to submit suggestion. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "75vh",
        background: "#fff7ed",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "650px",
          margin: "auto",
          background: "white",
          padding: "35px",
          borderRadius: "18px",
          boxShadow:
            "0 5px 25px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: "45px",
            marginBottom: "10px",
          }}
        >
          💬
        </div>

        <h1
          style={{
            textAlign: "center",
            color: "#e85d04",
            marginBottom: "10px",
          }}
        >
          Share Your Suggestion
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#777",
            marginBottom: "30px",
          }}
        >
          Help us make Hungry Town better! 🍴
        </p>

        <div
          style={{
            background: "#fff7ed",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <p style={{ margin: "5px 0" }}>
            <strong>Name:</strong>{" "}
            {user?.name || "User"}
          </p>

          <p style={{ margin: "5px 0" }}>
            <strong>Email:</strong>{" "}
            {user?.email || ""}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "8px",
              color: "#333",
            }}
          >
            Your Suggestion
          </label>

          <textarea
            value={suggestion}
            onChange={(event) =>
              setSuggestion(event.target.value)
            }
            placeholder="Write your suggestion here..."
            rows="6"
            style={{
              width: "100%",
              padding: "13px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "15px",
              resize: "vertical",
              boxSizing: "border-box",
              fontFamily: "Arial, sans-serif",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "18px",
              padding: "14px",
              background: loading
                ? "#999"
                : "#e85d04",
              color: "white",
              border: "none",
              borderRadius: "9px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Submitting..."
              : "💬 Submit Suggestion"}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#e8f5e9",
              color: "#2e7d32",
              borderRadius: "7px",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Suggestions;