import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://https://food-ordering-5v9t.onrender.com/api/users/${user.id}/orders`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch orders"
          );
        }

        const ordersWithItems = await Promise.all(
          data.map(async (order) => {
            try {
              const itemResponse = await fetch(
                `http://https://food-ordering-5v9t.onrender.com/api/orders/${order.id}/items`
              );

              const items = await itemResponse.json();

              return {
                ...order,
                items: Array.isArray(items) ? items : [],
              };
            } catch (error) {
              return {
                ...order,
                items: [],
              };
            }
          })
        );

        setOrders(ordersWithItems);
      } catch (error) {
        console.error("Orders fetch error:", error);

        setError(
          error.message || "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  const getStatusClass = (status) => {
    return String(status || "Pending")
      .toLowerCase()
      .replaceAll(" ", "-");
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "Pending":
        return "Your order has been received.";

      case "Preparing":
        return "Your food is being prepared.";

      case "Out for Delivery":
        return "Your order is on the way.";

      case "Delivered":
        return "Your order has been delivered.";

      case "Cancelled":
        return "This order has been cancelled.";

      default:
        return "Your order is being processed.";
    }
  };

  /*
    Returns the timeline state for each step.

    completed = already finished
    current   = current order status
    pending   = not reached yet
  */
  const getTimelineState = (status, step) => {
    const statusOrder = {
      Pending: 0,
      Preparing: 1,
      "Out for Delivery": 2,
      Delivered: 3,
    };

    if (status === "Cancelled") {
      return step === "placed"
        ? "completed"
        : "cancelled";
    }

    const currentIndex = statusOrder[status] ?? 0;

    const stepIndex = {
      placed: 0,
      preparing: 1,
      delivery: 2,
      delivered: 3,
    };

    const index = stepIndex[step];

    if (index < currentIndex) {
      return "completed";
    }

    if (index === currentIndex) {
      return "current";
    }

    return "pending";
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-loading">
            <div className="orders-spinner">⏳</div>
            <h2>Loading Your Orders...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-empty">
            <div className="orders-empty-icon">🔐</div>

            <h2>Please Login First</h2>

            <p>
              Login to view your Hungry Town orders.
            </p>

            <Link
              to="/login"
              className="orders-main-button"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">

        {/* ================= HEADER ================= */}

        <div className="orders-header">
          <div>
            <h1>📦 My Orders</h1>

            <p>
              Track your Hungry Town orders
            </p>
          </div>

          <Link
            to="/menu"
            className="orders-order-button"
          >
            🍔 Order More
          </Link>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="orders-error">
            {error}
          </div>
        )}

        {/* ================= NO ORDERS ================= */}

        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">
              🍽️
            </div>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <Link
              to="/menu"
              className="orders-main-button"
            >
              Browse Menu
            </Link>
          </div>
        ) : (

          /* ================= ORDERS ================= */

          <div className="orders-list">

            {orders.map((order) => {
              const status = order.status || "Pending";

              const placedState =
                getTimelineState(status, "placed");

              const preparingState =
                getTimelineState(status, "preparing");

              const deliveryState =
                getTimelineState(status, "delivery");

              const deliveredState =
                getTimelineState(status, "delivered");

              return (
                <div
                  className="user-order-card"
                  key={order.id}
                >

                  {/* ================= ORDER HEADER ================= */}

                  <div className="user-order-header">
                    <div>
                      <h2>
                        Order #{order.id}
                      </h2>

                      <p>
                        {order.created_at
                          ? new Date(
                              order.created_at
                            ).toLocaleString()
                          : ""}
                      </p>
                    </div>

                    <div className="user-order-total">
                      ₹
                      {Number(
                        order.total_amount || 0
                      ).toFixed(2)}
                    </div>
                  </div>

                  {/* ================= STATUS ================= */}

                  <div className="user-order-status">

                    <span
                      className={`user-status-badge status-${getStatusClass(
                        status
                      )}`}
                    >
                      {status}
                    </span>

                    <p>
                      {getStatusMessage(status)}
                    </p>

                  </div>

                  {/* ================= ORDER TIMELINE ================= */}

                  {status === "Cancelled" ? (

                    <div className="order-timeline cancelled-timeline">

                      <div className="timeline-step completed">
                        <div className="timeline-dot">
                          ✓
                        </div>

                        <div className="timeline-content">
                          <strong>
                            Order Placed
                          </strong>

                          <span>
                            Order received
                          </span>
                        </div>
                      </div>

                      <div className="timeline-connector cancelled-line" />

                      <div className="timeline-step cancelled">
                        <div className="timeline-dot">
                          ✕
                        </div>

                        <div className="timeline-content">
                          <strong>
                            Cancelled
                          </strong>

                          <span>
                            Order cancelled
                          </span>
                        </div>
                      </div>

                    </div>

                  ) : (

                    <div className="order-timeline">

                      {/* ORDER PLACED */}

                      <div
                        className={`timeline-step ${placedState}`}
                      >
                        <div className="timeline-dot">
                          ✓
                        </div>

                        <div className="timeline-content">
                          <strong>
                            Order Placed
                          </strong>

                          <span>
                            Order received
                          </span>
                        </div>
                      </div>

                      {/* LINE */}

                      <div
                        className={`timeline-connector ${
                          preparingState === "completed" ||
                          preparingState === "current"
                            ? "active"
                            : ""
                        }`}
                      />

                      {/* PREPARING */}

                      <div
                        className={`timeline-step ${preparingState}`}
                      >
                        <div className="timeline-dot">
                          🍳
                        </div>

                        <div className="timeline-content">
                          <strong>
                            Preparing
                          </strong>

                          <span>
                            Food is being prepared
                          </span>
                        </div>
                      </div>

                      {/* LINE */}

                      <div
                        className={`timeline-connector ${
                          deliveryState === "completed" ||
                          deliveryState === "current"
                            ? "active"
                            : ""
                        }`}
                      />

                      {/* ON THE WAY */}

                      <div
                        className={`timeline-step ${deliveryState}`}
                      >
                        <div className="timeline-dot">
                          🛵
                        </div>

                        <div className="timeline-content">
                          <strong>
                            On the Way
                          </strong>

                          <span>
                            Out for delivery
                          </span>
                        </div>
                      </div>

                      {/* LINE */}

                      <div
                        className={`timeline-connector ${
                          deliveredState === "completed" ||
                          deliveredState === "current"
                            ? "active"
                            : ""
                        }`}
                      />

                      {/* DELIVERED */}

                      <div
                        className={`timeline-step ${deliveredState}`}
                      >
                        <div className="timeline-dot">
                          ✓
                        </div>

                        <div className="timeline-content">
                          <strong>
                            Delivered
                          </strong>

                          <span>
                            Order delivered
                          </span>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ================= CANCELLED MESSAGE ================= */}

                  {status === "Cancelled" && (
                    <div className="order-cancelled-message">
                      ❌ This order was cancelled.
                    </div>
                  )}

                  {/* ================= ORDER ITEMS ================= */}

                  <div className="user-order-items">

                    <h3>
                      🍴 Ordered Items
                    </h3>

                    {order.items &&
                    order.items.length > 0 ? (
                      order.items.map(
                        (item, index) => (
                          <div
                            className="user-order-item"
                            key={
                              item.id || index
                            }
                          >

                            <div>
                              <strong>
                                {item.food_name}
                              </strong>

                              <span>
                                ×{" "}
                                {item.quantity}
                              </span>
                            </div>

                            <strong>
                              ₹
                              {(
                                Number(
                                  item.price || 0
                                ) *
                                Number(
                                  item.quantity || 1
                                )
                              ).toFixed(2)}
                            </strong>

                          </div>
                        )
                      )
                    ) : (
                      <p>
                        No item details available.
                      </p>
                    )}

                  </div>

                  {/* ================= COUPON ================= */}

                  {order.coupon_code && (
                    <div className="user-order-coupon">

                      🎟️ Coupon Applied:

                      <strong>
                        {order.coupon_code}
                      </strong>

                      <span>
                        Saved ₹
                        {Number(
                          order.discount_amount || 0
                        ).toFixed(2)}
                      </span>

                    </div>
                  )}

                  {/* ================= ADDRESS ================= */}

                  <div className="user-order-address">

                    <strong>
                      📍 Delivery Address
                    </strong>

                    <p>
                      {order.address}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default Orders;