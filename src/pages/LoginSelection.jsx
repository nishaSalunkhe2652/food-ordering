import { useNavigate } from "react-router-dom";

function LoginSelection() {
  const navigate = useNavigate();

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
          maxWidth: "500px",
          background: "white",
          padding: "40px",
          borderRadius: "18px",
          boxShadow: "0 5px 25px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "50px",
            marginBottom: "10px",
          }}
        >
          🍴
        </div>

        <h1
          style={{
            margin: "0 0 8px",
            color: "#e85d04",
            fontSize: "32px",
          }}
        >
          Hungry Town
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "35px",
            fontSize: "16px",
          }}
        >
          GOOD FOOD • HAPPY MOOD
        </p>

        <h2
          style={{
            marginBottom: "10px",
            color: "#333",
          }}
        >
          Welcome! 👋
        </h2>

        <p
          style={{
            color: "#777",
            marginBottom: "30px",
          }}
        >
          How would you like to continue?
        </p>

        {/* USER OPTION */}

        <button
          onClick={() => navigate("/login")}
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "15px",
            background: "#e85d04",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "17px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          👤 Continue as User
        </button>

        {/* ADMIN OPTION */}

        <button
          onClick={() => navigate("/admin-login")}
          style={{
            width: "100%",
            padding: "15px",
            background: "#333",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "17px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          👨‍💼 Continue as Admin
        </button>
      </div>
    </div>
  );
}

export default LoginSelection;