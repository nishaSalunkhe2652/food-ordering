import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const navigate = useNavigate();

  // =====================================
  // PASSWORD STRENGTH VALIDATION
  // =====================================

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return passwordRegex.test(password);
  };

  // =====================================
  // SIGNUP
  // =====================================

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (!validatePassword(password)) {
      alert(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Signup failed"
        );
        return;
      }

      alert(
        "Account created successfully! Please login."
      );

      navigate("/login");
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

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
          boxShadow:
            "0 5px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#e85d04",
          }}
        >
          Create Account 🍴
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Create your Hungry Town account
        </p>

        <form onSubmit={handleSignup}>

          {/* NAME */}

          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
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
            onChange={(e) =>
              setEmail(e.target.value)
            }
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
              marginBottom: "8px",
            }}
          >
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter strong password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
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

          {/* PASSWORD RULES */}

          <div
            style={{
              background: "#fff8f3",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "18px",
              fontSize: "12px",
              color: "#666",
            }}
          >
            <strong>
              Password must contain:
            </strong>

            <div>
              • At least 8 characters
            </div>

            <div>
              • One uppercase letter (A-Z)
            </div>

            <div>
              • One lowercase letter (a-z)
            </div>

            <div>
              • One number (0-9)
            </div>

            <div>
              • One special character (@ $ ! % * ? &)
            </div>
          </div>

          {/* CONFIRM PASSWORD */}

          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Confirm Password
          </label>

          <div
            style={{
              position: "relative",
              width: "100%",
              marginBottom: "22px",
            }}
          >
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
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
                setShowConfirmPassword(
                  !showConfirmPassword
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
                fontSize: "18px",
                padding: "4px",
              }}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword
                ? "🙈"
                : "👁️"}
            </button>
          </div>

          {/* SIGNUP BUTTON */}

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
            Create Account
          </button>
        </form>

        {/* LOGIN LINK */}

        <p
          style={{
            textAlign: "center",
            marginTop: "22px",
            color: "#666",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#e85d04",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;