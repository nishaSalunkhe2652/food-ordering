
import { useEffect, useState } from "react";
import "./Admin.css";

function Admin() {
  const [orders, setOrders] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offersLoading, setOffersLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showOffers, setShowOffers] = useState(true);

  const [offerForm, setOfferForm] = useState({
    offer_name: "",
    coupon_code: "",
    discount_type: "flat",
    discount_value: "",
    minimum_order_amount: "",
    start_date: "",
    end_date: "",
    maximum_uses: "",
  });

  const [editingOffer, setEditingOffer] = useState(null);

  // =========================
  // FETCH ORDERS
  // =========================
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://https://food-ordering-5v9t.onrender.com/api/orders"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      const orderList = Array.isArray(data)
        ? data
        : Array.isArray(data.orders)
        ? data.orders
        : [];

      const ordersWithItems = await Promise.all(
        orderList.map(async (order) => {
          try {
            const itemResponse = await fetch(
              "http://https://food-ordering-5v9t.onrender.com/api/orders/" +
                order.id +
                "/items"
            );

            if (itemResponse.ok) {
              const itemData = await itemResponse.json();

              const items = Array.isArray(itemData)
                ? itemData
                : Array.isArray(itemData.items)
                ? itemData.items
                : [];

              return {
                ...order,
                items,
              };
            }
          } catch (error) {
            console.log(
              "Could not fetch order items:",
              error
            );
          }

          return {
            ...order,
            items: [],
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error("Orders error:", error);
      setOrders([]);
    }
  };

  // =========================
  // FETCH SUGGESTIONS
  // =========================
  const fetchSuggestions = async () => {
    try {
      const response = await fetch(
        "http://https://food-ordering-5v9t.onrender.com/api/suggestions"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();

      const suggestionList = Array.isArray(data)
        ? data
        : Array.isArray(data.suggestions)
        ? data.suggestions
        : [];

      setSuggestions(suggestionList);
    } catch (error) {
      console.error("Suggestions error:", error);
      setSuggestions([]);
    }
  };

  // =========================
  // FETCH OFFERS
  // =========================
  const fetchOffers = async () => {
    setOffersLoading(true);

    try {
      const response = await fetch(
        "http://https://food-ordering-5v9t.onrender.com/api/admin/offers"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch offers");
      }

      const data = await response.json();

      const offerList = Array.isArray(data)
        ? data
        : Array.isArray(data.offers)
        ? data.offers
        : [];

      setOffers(offerList);
    } catch (error) {
      console.error("Offers error:", error);
      setOffers([]);
    } finally {
      setOffersLoading(false);
    }
  };

  // =========================
  // LOAD DASHBOARD
  // =========================
  const loadDashboard = async () => {
    setLoading(true);

    await Promise.all([
      fetchOrders(),
      fetchSuggestions(),
      fetchOffers(),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();

    const openOffers = () => {
      setShowOffers(true);

      setTimeout(() => {
        const section =
          document.getElementById("offers-section");

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 100);
    };

    const openOrders = () => {
      setShowOffers(false);

      setTimeout(() => {
        const section =
          document.getElementById("orders-section");

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 100);
    };

    const openSuggestions = () => {
      setShowOffers(false);

      setTimeout(() => {
        const section =
          document.getElementById(
            "suggestions-section"
          );

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 100);
    };

    window.addEventListener(
      "admin-show-offers",
      openOffers
    );

    window.addEventListener(
      "admin-show-orders",
      openOrders
    );

    window.addEventListener(
      "admin-show-suggestions",
      openSuggestions
    );

    return () => {
      window.removeEventListener(
        "admin-show-offers",
        openOffers
      );

      window.removeEventListener(
        "admin-show-orders",
        openOrders
      );

      window.removeEventListener(
        "admin-show-suggestions",
        openSuggestions
      );
    };
  }, []);

  // =========================
  // OFFER FORM CHANGE
  // =========================
  const handleOfferChange = (event) => {
    const { name, value } = event.target;

    setOfferForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // RESET OFFER FORM
  // =========================
  const resetOfferForm = () => {
    setOfferForm({
      offer_name: "",
      coupon_code: "",
      discount_type: "flat",
      discount_value: "",
      minimum_order_amount: "",
      start_date: "",
      end_date: "",
      maximum_uses: "",
    });

    setEditingOffer(null);
  };

  // =========================
  // CREATE / UPDATE OFFER
  // =========================
  const handleOfferSubmit = async (event) => {
    event.preventDefault();

    if (!offerForm.offer_name.trim()) {
      alert("Please enter offer name");
      return;
    }

    if (!offerForm.coupon_code.trim()) {
      alert("Please enter coupon code");
      return;
    }

    if (!offerForm.discount_value) {
      alert("Please enter discount value");
      return;
    }

    if (
      offerForm.discount_type === "percentage" &&
      Number(offerForm.discount_value) > 100
    ) {
      alert(
        "Percentage discount cannot be more than 100%"
      );
      return;
    }

    if (!offerForm.start_date) {
      alert("Please select start date");
      return;
    }

    if (!offerForm.end_date) {
      alert("Please select end date");
      return;
    }

    if (
      new Date(offerForm.end_date) <
      new Date(offerForm.start_date)
    ) {
      alert("End date must be after start date");
      return;
    }

    const offerData = {
      offer_name: offerForm.offer_name.trim(),

      coupon_code: offerForm.coupon_code
        .trim()
        .toUpperCase(),

      discount_type: offerForm.discount_type,

      discount_value: Number(
        offerForm.discount_value
      ),

      minimum_order_amount:
        Number(offerForm.minimum_order_amount) || 0,

      start_date: offerForm.start_date,

      end_date: offerForm.end_date,

      maximum_uses: offerForm.maximum_uses
        ? Number(offerForm.maximum_uses)
        : null,
    };

    if (editingOffer) {
      offerData.is_active = editingOffer.is_active;
    }

    try {
      const url = editingOffer
        ? "http://https://food-ordering-5v9t.onrender.com/api/offers/" +
          editingOffer.id
        : "http://https://food-ordering-5v9t.onrender.com/api/offers";

      const method = editingOffer ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(offerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save offer"
        );
      }

      alert(
        editingOffer
          ? "Offer updated successfully!"
          : "Offer created successfully!"
      );

      resetOfferForm();
      fetchOffers();
    } catch (error) {
      console.error("Offer save error:", error);
      alert(error.message);
    }
  };

  // =========================
  // EDIT OFFER
  // =========================
  const handleEditOffer = (offer) => {
    setEditingOffer(offer);

    setOfferForm({
      offer_name: offer.offer_name || "",

      coupon_code: offer.coupon_code || "",

      discount_type:
        offer.discount_type || "flat",

      discount_value:
        offer.discount_value !== undefined
          ? offer.discount_value
          : "",

      minimum_order_amount:
        offer.minimum_order_amount !== undefined
          ? offer.minimum_order_amount
          : "",

      start_date: offer.start_date
        ? String(offer.start_date).slice(0, 16)
        : "",

      end_date: offer.end_date
        ? String(offer.end_date).slice(0, 16)
        : "",

      maximum_uses:
        offer.maximum_uses !== null &&
        offer.maximum_uses !== undefined
          ? offer.maximum_uses
          : "",
    });

    setShowOffers(true);

    setTimeout(() => {
      const section =
        document.getElementById("offers-section");

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 100);
  };

  // =========================
  // DELETE OFFER
  // =========================
  const handleDeleteOffer = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this offer?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        "http://https://food-ordering-5v9t.onrender.com/api/offers/" + id,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete offer"
        );
      }

      alert("Offer deleted successfully!");

      fetchOffers();
    } catch (error) {
      console.error("Delete offer error:", error);
      alert(error.message);
    }
  };

  // =========================
  // STOP / RESUME OFFER
  // =========================
  const handleToggleOffer = async (offer) => {
    try {
      const response = await fetch(
        "http://https://food-ordering-5v9t.onrender.com/api/offers/" +
          offer.id,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            offer_name: offer.offer_name,

            coupon_code: offer.coupon_code,

            discount_type: offer.discount_type,

            discount_value: Number(
              offer.discount_value
            ),

            minimum_order_amount:
              Number(offer.minimum_order_amount) || 0,

            start_date: offer.start_date,

            end_date: offer.end_date,

            maximum_uses:
              offer.maximum_uses !== null &&
              offer.maximum_uses !== undefined
                ? Number(offer.maximum_uses)
                : null,

            is_active: !Boolean(offer.is_active),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update offer"
        );
      }

      fetchOffers();
    } catch (error) {
      console.error("Toggle offer error:", error);
      alert(error.message);
    }
  };

  // =========================
  // FILTER ORDERS
  // =========================
  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      String(order.id || "")
        .toLowerCase()
        .includes(search) ||
      String(order.name || "")
        .toLowerCase()
        .includes(search) ||
      String(order.mobile || "")
        .toLowerCase()
        .includes(search) ||
      String(order.phone || "")
        .toLowerCase()
        .includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      String(order.status || "").toLowerCase() ===
        statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        style={{
          padding: "50px",
          textAlign: "center",
        }}
      >
        <h2>Loading Admin Dashboard...</h2>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================
  return (
    <div className="admin-page">
      <div className="admin-container">

        {/* HEADER */}
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>
              Manage orders, suggestions and offers
            </p>
          </div>

          <button
            onClick={loadDashboard}
            className="refresh-btn"
          >
            🔄 Refresh
          </button>
        </div>

        {/* DASHBOARD CARDS */}
        <div className="admin-stats">
          <div className="stat-card">
            <h3>📦 Orders</h3>
            <strong>{orders.length}</strong>
          </div>

          <div className="stat-card">
            <h3>💬 Suggestions</h3>
            <strong>{suggestions.length}</strong>
          </div>

          <div className="stat-card">
            <h3>🎁 Offers</h3>
            <strong>{offers.length}</strong>
          </div>
        </div>

        {/* =========================
            OFFERS
        ========================= */}
        {showOffers && (
          <section
            id="offers-section"
            className="admin-section offers-section"
          >
            <div className="section-header">
              <div>
                <h2>🎁 Offers & Coupons</h2>

                <p>
                  Create and manage discount offers
                </p>
              </div>

              <button
                onClick={() => setShowOffers(false)}
                className="secondary-btn"
              >
                Hide Offers
              </button>
            </div>

            {/* OFFER FORM */}
            <form
              onSubmit={handleOfferSubmit}
              className="offer-form"
            >
              <div className="form-row">

                <div className="form-group">
                  <label>Offer Name</label>

                  <input
                    type="text"
                    name="offer_name"
                    value={offerForm.offer_name}
                    onChange={handleOfferChange}
                    placeholder="Example: Diwali Special"
                  />
                </div>

                <div className="form-group">
                  <label>Coupon Code</label>

                  <input
                    type="text"
                    name="coupon_code"
                    value={offerForm.coupon_code}
                    onChange={handleOfferChange}
                    placeholder="Example: DIWALI50"
                  />
                </div>

              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Discount Type</label>

                  <select
                    name="discount_type"
                    value={offerForm.discount_type}
                    onChange={handleOfferChange}
                  >
                    <option value="flat">
                      Flat Amount
                    </option>

                    <option value="percentage">
                      Percentage
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Discount Value</label>

                  <input
                    type="number"
                    name="discount_value"
                    value={
                      offerForm.discount_value
                    }
                    onChange={handleOfferChange}
                    placeholder={
                      offerForm.discount_type ===
                      "percentage"
                        ? "Example: 20"
                        : "Example: 100"
                    }
                    min="0"
                  />
                </div>

              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>
                    Minimum Order Amount
                  </label>

                  <input
                    type="number"
                    name="minimum_order_amount"
                    value={
                      offerForm.minimum_order_amount
                    }
                    onChange={handleOfferChange}
                    placeholder="Example: 500"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Maximum Uses</label>

                  <input
                    type="number"
                    name="maximum_uses"
                    value={
                      offerForm.maximum_uses
                    }
                    onChange={handleOfferChange}
                    placeholder="Leave empty for unlimited"
                    min="1"
                  />
                </div>

              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Start Date</label>

                  <input
                    type="datetime-local"
                    name="start_date"
                    value={offerForm.start_date}
                    onChange={handleOfferChange}
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>

                  <input
                    type="datetime-local"
                    name="end_date"
                    value={offerForm.end_date}
                    onChange={handleOfferChange}
                  />
                </div>

              </div>

              <div className="offer-form-buttons">

                <button
                  type="submit"
                  className="primary-btn"
                >
                  {editingOffer
                    ? "✏️ Update Offer"
                    : "➕ Create Offer"}
                </button>

                {editingOffer && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={resetOfferForm}
                  >
                    Cancel Edit
                  </button>
                )}

              </div>
            </form>

            {/* EXISTING OFFERS */}
            <div className="existing-offers">
              <h3>Existing Offers</h3>

              {offersLoading ? (
                <p>Loading offers...</p>
              ) : offers.length === 0 ? (
                <div className="empty-state">
                  <h3>No offers found</h3>

                  <p>
                    Create your first offer using
                    the form above.
                  </p>
                </div>
              ) : (
                <div className="offers-grid">

                  {offers.map((offer) => (
                    <div
                      className="offer-card"
                      key={offer.id}
                    >

                      <div className="offer-card-header">

                        <div>
                          <h3>
                            {offer.offer_name}
                          </h3>

                          <div className="coupon-code">
                            {offer.coupon_code}
                          </div>
                        </div>

                        <span
                          className={
                            Boolean(offer.is_active)
                              ? "offer-active"
                              : "offer-paused"
                          }
                        >
                          {Boolean(offer.is_active)
                            ? "ACTIVE"
                            : "PAUSED"}
                        </span>

                      </div>

                      <div className="offer-details">

                        <p>
                          <strong>
                            Discount:
                          </strong>{" "}
                          {offer.discount_type ===
                          "percentage"
                            ? offer.discount_value + "%"
                            : "₹" +
                              offer.discount_value}
                        </p>

                        <p>
                          <strong>
                            Minimum Order:
                          </strong>{" "}
                          ₹
                          {offer.minimum_order_amount ||
                            0}
                        </p>

                        <p>
                          <strong>Used:</strong>{" "}
                          {offer.used_count || 0}

                          {offer.maximum_uses !== null &&
                            offer.maximum_uses !==
                              undefined &&
                            " / " +
                              offer.maximum_uses}
                        </p>

                        <p>
                          <strong>Start:</strong>{" "}
                          {offer.start_date
                            ? String(
                                offer.start_date
                              ).slice(0, 16)
                            : "-"}
                        </p>

                        <p>
                          <strong>End:</strong>{" "}
                          {offer.end_date
                            ? String(
                                offer.end_date
                              ).slice(0, 16)
                            : "-"}
                        </p>

                      </div>

                      <div className="offer-actions">

                        <button
                          onClick={() =>
                            handleEditOffer(offer)
                          }
                          className="edit-btn"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() =>
                            handleToggleOffer(
                              offer
                            )
                          }
                          className="toggle-btn"
                        >
                          {Boolean(
                            offer.is_active
                          )
                            ? "⏸ Stop"
                            : "▶ Resume"}
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteOffer(
                              offer.id
                            )
                          }
                          className="delete-btn"
                        >
                          🗑 Delete
                        </button>

                      </div>

                    </div>
                  ))}

                </div>
              )}
            </div>
          </section>
        )}

        {/* =========================
            ORDERS
        ========================= */}
        <section
          id="orders-section"
          className="admin-section"
        >
          <div className="section-header">

            <div>
              <h2>📦 Orders</h2>
              <p>Manage customer orders</p>
            </div>

            {!showOffers && (
              <button
                onClick={() => setShowOffers(true)}
                className="primary-btn"
              >
                🎁 Show Offers
              </button>
            )}

          </div>

          <div className="filters">

            <input
              type="text"
              placeholder="Search by order ID, name or mobile..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Preparing">
                Preparing
              </option>

              <option value="Out for Delivery">
                Out for Delivery
              </option>

              <option value="Delivered">
                Delivered
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>

          </div>

          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <h3>No orders found</h3>
            </div>
          ) : (
            <div className="orders-list">

              {filteredOrders.map((order) => (
                <div
                  className="order-card"
                  key={order.id}
                >

                  <div className="order-header">

                    <div>
                      <h3>
                        Order #{order.id}
                      </h3>

                      <p>
                        Customer:{" "}
                        {order.name ||
                          order.customer_name ||
                          "N/A"}
                      </p>

                      <p>
                        Mobile:{" "}
                        {order.mobile ||
                          order.phone ||
                          "N/A"}
                      </p>
                    </div>

                    <span className="order-status">
                      {order.status || "Pending"}
                    </span>

                  </div>

                  <div className="order-items">

                    <h4>Items</h4>

                    {order.items &&
                    order.items.length > 0 ? (
                      order.items.map(
                        (item, index) => (
                          <div
                            className="order-item"
                            key={index}
                          >

                            <span>
                              {item.food_name ||
                                item.name ||
                                item.item_name ||
                                "Food Item"}
                            </span>

                            <span>
                              Qty:{" "}
                              {item.quantity || 1}
                            </span>

                            <span>
                              ₹
                              {item.price ||
                                item.item_price ||
                                0}
                            </span>

                          </div>
                        )
                      )
                    ) : (
                      <p>No item details</p>
                    )}

                  </div>

                  <div className="order-footer">
                    <strong>
                      Total: ₹
                      {order.total_amount ||
                        order.total ||
                        0}
                    </strong>
                  </div>

                </div>
              ))}

            </div>
          )}
        </section>

        {/* =========================
            SUGGESTIONS
        ========================= */}
        <section
          id="suggestions-section"
          className="admin-section"
        >

          <div className="section-header">

            <div>
              <h2>💬 Customer Suggestions</h2>

              <p>
                Suggestions received from customers
              </p>
            </div>

          </div>

          {suggestions.length === 0 ? (
            <div className="empty-state">
              <h3>No suggestions found</h3>
            </div>
          ) : (
            <div className="suggestions-list">

              {suggestions.map(
                (suggestion, index) => (
                  <div
                    className="suggestion-card"
                    key={
                      suggestion.id || index
                    }
                  >

                    <h3>
                      {suggestion.subject ||
                        suggestion.title ||
                        "Suggestion"}
                    </h3>

                    <p>
                      {suggestion.message ||
                        suggestion.suggestion ||
                        suggestion.description ||
                        "No message"}
                    </p>

                    <small>
                      {suggestion.name ||
                        suggestion.user_name ||
                        "Customer"}
                    </small>

                  </div>
                )
              )}

            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default Admin;

