import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Checkout.css";

function Checkout({ cart, clearCart }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderTotal, setOrderTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [coupon, setCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const savedCoupon = localStorage.getItem("hungryTownCoupon");

    if (savedCoupon) {
      try {
        setCoupon(JSON.parse(savedCoupon));
      } catch (error) {
        console.error("Saved coupon error:", error);
        localStorage.removeItem("hungryTownCoupon");
      }
    }
  }, []);

  const total = cart.reduce((sum, food) => {
    const price = Number(food.price) || 0;
    const quantity = Number(food.quantity) || 1;

    return sum + price * quantity;
  }, 0);

  const calculateDiscount = () => {
    if (!coupon) return 0;

    if (coupon.discount_type === "percentage") {
      return (total * Number(coupon.discount_value)) / 100;
    }

    return Number(coupon.discount_value) || 0;
  };

  const discount = Math.min(calculateDiscount(), total);

  const finalTotal = Math.max(total - discount, 0);

  const validateCoupon = async () => {
    if (!coupon) return true;

    setCouponLoading(true);
    setCouponError("");

    try {
      const response = await fetch(
        "http://https://food-ordering-5v9t.onrender.com/api/offers/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coupon_code: coupon.coupon_code,
            order_amount: total,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setCoupon(null);
        localStorage.removeItem("hungryTownCoupon");

        setCouponError(
          data.message || "Coupon is no longer valid."
        );

        return false;
      }

      setCoupon(data.offer);

      localStorage.setItem(
        "hungryTownCoupon",
        JSON.stringify(data.offer)
      );

      return true;
    } catch (error) {
      console.error("Coupon validation error:", error);

      setCouponError(
        "Unable to validate coupon. Please try again."
      );

      return false;
    } finally {
      setCouponLoading(false);
    }
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (!user) {
      setErrorMessage(
        "Please login before placing an order."
      );
      return;
    }

    if (!user.id) {
      setErrorMessage(
        "User information is missing. Please login again."
      );
      return;
    }

    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      setErrorMessage(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!address.trim()) {
      setErrorMessage(
        "Please enter your delivery address."
      );
      return;
    }

    if (!cart || cart.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    if (total <= 0) {
      setErrorMessage("Invalid order amount.");
      return;
    }

    setLoading(true);

    try {
      const couponValid = await validateCoupon();

      if (!couponValid) {
        setLoading(false);
        return;
      }

      let currentDiscount = 0;

      if (coupon) {
        if (coupon.discount_type === "percentage") {
          currentDiscount =
            (total * Number(coupon.discount_value)) / 100;
        } else {
          currentDiscount =
            Number(coupon.discount_value) || 0;
        }

        currentDiscount = Math.min(
          currentDiscount,
          total
        );
      }

      const currentFinalTotal = Math.max(
        total - currentDiscount,
        0
      );

      const items = cart.map((food) => ({
        food_id: food.id,
        food_name: food.name,
        quantity: Number(food.quantity) || 1,
        price: Number(food.price) || 0,
      }));

      const orderData = {
        user_id: user.id,
        customer_name: name.trim(),
        mobile: mobile.trim(),
        address: address.trim(),

        original_amount: Number(total.toFixed(2)),

        coupon_code: coupon
          ? coupon.coupon_code
          : null,

        discount_amount: Number(
          currentDiscount.toFixed(2)
        ),

        total_amount: Number(
          currentFinalTotal.toFixed(2)
        ),

        items,
      };

      console.log("ORDER DATA:", orderData);

      const response = await fetch(
        "http://https://food-ordering-5v9t.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order"
        );
      }

      setOrderId(data.orderId);
      setOrderTotal(currentFinalTotal);
      setOrderPlaced(true);

      localStorage.removeItem("hungryTownCoupon");
      setCoupon(null);

      if (clearCart) {
        clearCart();
      }
    } catch (error) {
      console.error("Place order error:", error);

      setErrorMessage(
        error.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-success">
            <div className="success-icon">✅</div>

            <h1>Order Placed Successfully!</h1>

            <p>
              Thank you for ordering from Hungry Town.
            </p>

            <div className="success-details">
              <div>
                <span>Order ID</span>
                <strong>#{orderId}</strong>
              </div>

              <div>
                <span>Payment Method</span>
                <strong>{paymentMethod}</strong>
              </div>

              <div>
                <span>Total Amount</span>
                <strong>
                  ₹{Number(orderTotal).toFixed(2)}
                </strong>
              </div>
            </div>

            <div className="checkout-success-buttons">
              <Link
                to="/orders"
                className="checkout-main-button"
              >
                View My Orders
              </Link>

              <Link
                to="/menu"
                className="checkout-secondary-button"
              >
                Order More Food
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        <h1 className="checkout-title">
          🧾 Checkout
        </h1>

        <p className="checkout-subtitle">
          Complete your order details
        </p>

        {errorMessage && (
          <div className="checkout-error">
            {errorMessage}
          </div>
        )}

        {couponError && (
          <div className="checkout-error">
            {couponError}
          </div>
        )}

        <section className="checkout-section">

          <h2>👤 Customer Details</h2>

          <form onSubmit={placeOrder}>

            <div className="checkout-form-group">
              <label>Full Name</label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter your full name"
              />
            </div>

            <div className="checkout-form-group">
              <label>Mobile Number</label>

              <input
                type="tel"
                value={mobile}
                onChange={(event) =>
                  setMobile(
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10)
                  )
                }
                placeholder="Enter 10-digit mobile number"
              />
            </div>

            <div className="checkout-form-group">
              <label>Delivery Address</label>

              <textarea
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
                placeholder="Enter your complete delivery address"
                rows="4"
              />
            </div>

            <div className="checkout-form-group">
              <label>Payment Method</label>

              <select
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
              >
                <option>Cash on Delivery</option>
                <option>UPI</option>
                <option>Credit / Debit Card</option>
              </select>
            </div>

            <section className="checkout-summary">

              <h2>📋 Order Summary</h2>

              <div className="checkout-summary-row">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>

              <div className="checkout-summary-row">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              {coupon && (
                <>
                  <div className="checkout-summary-row">
                    <span>Coupon</span>

                    <span className="coupon-code">
                      🎟️ {coupon.coupon_code}
                    </span>
                  </div>

                  <div className="checkout-summary-row">
                    <span>Discount</span>

                    <span className="discount-amount">
                      -₹{discount.toFixed(2)}
                    </span>
                  </div>
                </>
              )}

              <div className="checkout-summary-row">
                <span>Delivery</span>

                <span className="free-delivery">
                  FREE
                </span>
              </div>

              <div className="checkout-summary-total">
                <span>Final Amount</span>

                <strong>
                  ₹{finalTotal.toFixed(2)}
                </strong>
              </div>

            </section>

            <div className="checkout-buttons">

              <Link
                to="/cart"
                className="checkout-secondary-button"
              >
                ← Back to Cart
              </Link>

              <button
                type="submit"
                className="checkout-main-button"
                disabled={loading || couponLoading}
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order →"}
              </button>

            </div>

          </form>
        </section>
      </div>
    </div>
  );
}

export default Checkout;