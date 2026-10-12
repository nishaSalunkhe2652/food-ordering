import { useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin-login");
  };

  return (
    <nav
      style={{
        background: "#333",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        onClick={() => navigate("/admin")}
        style={{
          fontSize: "23px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        👨‍💼 Hungry Town Admin
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "25px",
        }}
      >
        <button
          onClick={() => navigate("/admin")}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          📊 Dashboard
        </button>

        <button
          onClick={() => navigate("/admin")}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          📦 Orders
        </button>

        <button
          onClick={() => navigate("/admin")}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          💬 Suggestions
        </button>

        <button
          onClick={handleLogout}
          style={{
            background: "#dc3545",
            color: "white",
            border: "none",
            padding: "9px 16px",
            borderRadius: "7px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🔐 Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;