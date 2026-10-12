
import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import LoginSelection from "./pages/LoginSelection";
import Home from "./pages/home";
import Menu from "./pages/Menu";
import Cart from "./pages/cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import ProtectedAdminRoute from "./pages/ProtectedAdminRoute";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Suggestions from "./pages/Suggestions";

function AdminNavbar({
  orderCount,
  suggestionCount,
  onDashboard,
  onOrders,
  onSuggestions,
  onOffers,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin-login", {
      replace: true,
    });
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
        onClick={onDashboard}
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
          onClick={onDashboard}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "15px",
            cursor: "pointer",
            padding: "8px",
          }}
        >
          📊 Dashboard
        </button>

        <button
          onClick={onOrders}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "15px",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          📦 Orders

          {orderCount > 0 && (
            <span
              style={{
                background: "#ff1744",
                color: "white",
                minWidth: "24px",
                height: "24px",
                padding: "0 6px",
                borderRadius: "20px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              +{orderCount}
            </span>
          )}
        </button>

        <button
          onClick={onSuggestions}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "15px",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          💬 Suggestions

          {suggestionCount > 0 && (
            <span
              style={{
                background: "#ff1744",
                color: "white",
                minWidth: "24px",
                height: "24px",
                padding: "0 6px",
                borderRadius: "20px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              +{suggestionCount}
            </span>
          )}
        </button>

        <button
          onClick={onOffers}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "15px",
            cursor: "pointer",
            padding: "8px",
          }}
        >
          🎁 Offers
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

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";
  const isAdminLogin =
    location.pathname === "/admin-login";

  const [cart, setCart] = useState([]);

  const [orderCount, setOrderCount] = useState(0);
  const [suggestionCount, setSuggestionCount] =
    useState(0);

  const lastOrderId = useRef(null);
  const lastSuggestionId = useRef(null);
  const notificationStarted = useRef(false);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    let stopped = false;

    const checkNotifications = async () => {
      try {
        const ordersResponse = await fetch(
          "http://https://food-ordering-5v9t.onrender.com/api/orders",
          {
            cache: "no-store",
          }
        );

        const suggestionsResponse = await fetch(
          "http://https://food-ordering-5v9t.onrender.com/api/suggestions",
          {
            cache: "no-store",
          }
        );

        if (
          !ordersResponse.ok ||
          !suggestionsResponse.ok
        ) {
          console.log("Notification API error");
          return;
        }

        const orders =
          await ordersResponse.json();

        const suggestions =
          await suggestionsResponse.json();

        if (stopped) {
          return;
        }

        const orderList = Array.isArray(orders)
          ? orders
          : Array.isArray(orders.orders)
          ? orders.orders
          : [];

        const suggestionList =
          Array.isArray(suggestions)
            ? suggestions
            : Array.isArray(
                suggestions.suggestions
              )
            ? suggestions.suggestions
            : [];

        let currentOrderId = 0;

        orderList.forEach((order) => {
          const id = Number(order.id) || 0;

          if (id > currentOrderId) {
            currentOrderId = id;
          }
        });

        let currentSuggestionId = 0;

        suggestionList.forEach((suggestion) => {
          const id =
            Number(suggestion.id) || 0;

          if (id > currentSuggestionId) {
            currentSuggestionId = id;
          }
        });

        if (!notificationStarted.current) {
          lastOrderId.current = currentOrderId;
          lastSuggestionId.current =
            currentSuggestionId;

          notificationStarted.current = true;

          setOrderCount(0);
          setSuggestionCount(0);

          return;
        }

        if (
          currentOrderId >
          lastOrderId.current
        ) {
          const newOrders =
            currentOrderId -
            lastOrderId.current;

          setOrderCount(
            (previous) =>
              previous + newOrders
          );

          lastOrderId.current =
            currentOrderId;
        }

        if (
          currentSuggestionId >
          lastSuggestionId.current
        ) {
          const newSuggestions =
            currentSuggestionId -
            lastSuggestionId.current;

          setSuggestionCount(
            (previous) =>
              previous + newSuggestions
          );

          lastSuggestionId.current =
            currentSuggestionId;
        }
      } catch (error) {
        console.error(
          "Notification error:",
          error
        );
      }
    };

    checkNotifications();

    const interval = setInterval(
      checkNotifications,
      5000
    );

    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, [isAdmin]);

  const handleDashboard = () => {
    window.history.replaceState(
      null,
      "",
      window.location.pathname
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleOrders = () => {
    window.history.replaceState(
      null,
      "",
      window.location.pathname
    );

    setOrderCount(0);

    setTimeout(() => {
      const element =
        document.getElementById(
          "orders-section"
        );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  const handleSuggestions = () => {
    window.history.replaceState(
      null,
      "",
      window.location.pathname
    );

    setSuggestionCount(0);

    setTimeout(() => {
      const element =
        document.getElementById(
          "suggestions-section"
        );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  const handleOffers = () => {
    window.location.hash = "offers";

    setTimeout(() => {
      const element =
        document.getElementById(
          "offers-section"
        );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  const addToCart = (food) => {
    setCart((previousCart) => [
      ...previousCart,
      food,
    ]);
  };

  const increaseQuantity = (foodId) => {
    const foodItem = cart.find(
      (food) => food.id === foodId
    );

    if (foodItem) {
      setCart((previousCart) => [
        ...previousCart,
        foodItem,
      ]);
    }
  };

  const decreaseQuantity = (foodId) => {
    const index = cart.findIndex(
      (food) => food.id === foodId
    );

    if (index !== -1) {
      setCart((previousCart) =>
        previousCart.filter(
          (_, itemIndex) =>
            itemIndex !== index
        )
      );
    }
  };

  const removeFromCart = (foodId) => {
    setCart((previousCart) =>
      previousCart.filter(
        (food) => food.id !== foodId
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <>
      {!isAdmin && !isAdminLogin && (
        <Navbar />
      )}

      {isAdmin && (
        <AdminNavbar
          orderCount={orderCount}
          suggestionCount={suggestionCount}
          onDashboard={handleDashboard}
          onOrders={handleOrders}
          onSuggestions={
            handleSuggestions
          }
          onOffers={handleOffers}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={<LoginSelection />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/menu"
          element={
            <Menu
              addToCart={addToCart}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              increaseQuantity={
                increaseQuantity
              }
              decreaseQuantity={
                decreaseQuantity
              }
              removeFromCart={
                removeFromCart
              }
              clearCart={clearCart}
            />
          }
        />

        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              setCart={setCart}
              clearCart={clearCart}
            />
          }
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/favorites"
          element={
            <Favorites
              addToCart={addToCart}
            />
          }
        />

        <Route
          path="/suggestions"
          element={<Suggestions />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <Admin />
            </ProtectedAdminRoute>
          }
        />
      </Routes>

      {!isAdmin && !isAdminLogin && (
        <Footer />
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
