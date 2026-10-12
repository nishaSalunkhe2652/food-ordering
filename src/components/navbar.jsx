import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "#ffffff",
        padding: "15px 30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* BRAND */}
      <Link
        to="/home"
        className="brand"
        style={{
          textDecoration: "none",
          color: "#e85d04",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        🍴 Hungry Town
      </Link>

      {/* NAVIGATION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          flexWrap: "wrap",
        }}
      >
        <NavLink
          to="/home"
          style={{
            textDecoration: "none",
            color: "#333",
            fontWeight: "500",
          }}
        >
          🏠 Home
        </NavLink>

        <NavLink
          to="/menu"
          style={{
            textDecoration: "none",
            color: "#333",
            fontWeight: "500",
          }}
        >
          🍽️ Menu
        </NavLink>

        <NavLink
          to="/favorites"
          style={{
            textDecoration: "none",
            color: "#333",
            fontWeight: "500",
          }}
        >
          ❤️ Favorites
        </NavLink>

        <NavLink
          to="/cart"
          style={{
            textDecoration: "none",
            color: "#333",
            fontWeight: "500",
          }}
        >
          🛒 Cart
        </NavLink>

        <NavLink
          to="/orders"
          style={{
            textDecoration: "none",
            color: "#333",
            fontWeight: "500",
          }}
        >
          📦 My Orders
        </NavLink>

        <NavLink
          to="/suggestions"
          style={{
            textDecoration: "none",
            color: "#333",
            fontWeight: "500",
          }}
        >
          💬 Suggestions
        </NavLink>

        {user ? (
          <>
            <span
              style={{
                color: "#e85d04",
                fontWeight: "bold",
              }}
            >
              Hi, {user.name} 👋
            </span>

            <button
              onClick={handleLogout}
              style={{
                padding: "8px 14px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 14px",
              background: "#e85d04",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;