import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login successful!");

      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);

      alert(
        "Cannot connect to server. Please make sure backend is running."
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "75vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fff7ed",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          padding: "35px",
          borderRadius: "15px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#e85d04",
          }}
        >
          Welcome Back 🍴
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Login to your Hungry Town account
        </p>

        <form onSubmit={handleLogin}>
          {/* EMAIL */}

          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "18px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxSizing: "border-box",
              fontSize: "14px",
            }}
          />

          {/* PASSWORD */}

          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Password
          </label>

          <div
            style={{
              position: "relative",
              width: "100%",
              marginBottom: "22px",
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 45px 12px 12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box",
                fontSize: "14px",
              }}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "18px",
                padding: "4px",
              }}
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px",
              background: "#e85d04",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        {/* SIGN UP */}

        <p
          style={{
            textAlign: "center",
            marginTop: "22px",
            color: "#666",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "#e85d04",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Sign Up
          </Link>
        </p>

        {/* DIVIDER */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "25px 0 20px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "#ddd",
            }}
          ></div>

          <span
            style={{
              color: "#999",
              fontSize: "13px",
            }}
          >
            OR
          </span>

          <div
            style={{
              flex: 1,
              height: "1px",
              background: "#ddd",
            }}
          ></div>
        </div>

        {/* ADMIN LOGIN */}

        <div
          style={{
            textAlign: "center",
          }}
        >
          <p
            style={{
              marginBottom: "10px",
              color: "#555",
              fontSize: "14px",
            }}
          >
            Are you an Admin?
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin-login")}
            style={{
              width: "100%",
              padding: "12px",
              background: "#333",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            👨‍💼 Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;