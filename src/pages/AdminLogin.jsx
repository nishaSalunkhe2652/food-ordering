import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      email === "nisha1923@gmail.com" &&
      password === "nisha1923"
    ) {
      localStorage.setItem(
        "admin",
        JSON.stringify({
          email: email,
        })
      );

      navigate("/admin");
    } else {
      alert("Invalid admin email or password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fff7ed",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
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
            fontSize: "50px",
            marginBottom: "10px",
          }}
        >
          👨‍💼
        </div>

        <h1
          style={{
            textAlign: "center",
            color: "#e85d04",
            marginBottom: "8px",
          }}
        >
          Admin Login
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#777",
            marginBottom: "30px",
          }}
        >
          Login to manage Hungry Town
        </p>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Email
          </label>

          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            style={{
              width: "100%",
              padding: "13px",
              marginBottom: "18px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxSizing: "border-box",
              fontSize: "15px",
            }}
          />

          <label
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Password
          </label>

          <div
            style={{
              position: "relative",
              marginBottom: "22px",
            }}
          >
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter admin password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              style={{
                width: "100%",
                padding:
                  "13px 45px 13px 13px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box",
                fontSize: "15px",
              }}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform:
                  "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "19px",
                padding: "5px",
              }}
            >
              {showPassword
                ? "🙈"
                : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: "#333",
              color: "white",
              border: "none",
              borderRadius: "9px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🔐 Login as Admin
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "12px",
            background: "transparent",
            color: "#e85d04",
            border:
              "1px solid #e85d04",
            borderRadius: "9px",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;