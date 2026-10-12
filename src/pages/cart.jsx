import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart({
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
}) {
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  // =========================
  // LOAD SAVED COUPON
  // =========================

  useEffect(() => {
    const savedCoupon = localStorage.getItem(
      "hungryTownCoupon"
    );

    if (savedCoupon) {
      try {
        const parsedCoupon = JSON.parse(savedCoupon);

        setCoupon(parsedCoupon);

        setCouponCode(
          parsedCoupon.coupon_code || ""
        );
      } catch (error) {
        console.error(
          "Saved coupon error:",
          error
        );

        localStorage.removeItem(
          "hungryTownCoupon"
        );
      }
    }
  }, []);

  // =========================
  // GET QUANTITY
  // =========================

  const getQuantity = (foodId) => {
    return cart.filter(
      (food) => food.id === foodId
    ).length;
  };

  // =========================
  // UNIQUE FOODS
  // =========================

  const uniqueFoods = cart.filter(
    (food, index, self) =>
      index ===
      self.findIndex(
        (item) => item.id === food.id
      )
  );

  // =========================
  // CALCULATE TOTAL
  // =========================

  const total = cart.reduce(
    (sum, food) =>
      sum + (Number(food.price) || 0),
    0
  );

  // ==================================================
  // RE-CHECK COUPON WHEN CART TOTAL CHANGES
  // ==================================================

  useEffect(() => {
    if (!coupon || !coupon.coupon_code) {
      return;
    }

    // If cart becomes empty, remove coupon
    if (total <= 0) {
      setCoupon(null);
      setCouponCode("");
      setCouponMessage("");

      localStorage.removeItem(
        "hungryTownCoupon"
      );

      return;
    }

    let cancelled = false;

    const revalidateCoupon = async () => {
      try {
        const response = await fetch(
          "http://https://food-ordering-5v9t.onrender.com/api/offers/apply",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              coupon_code:
                coupon.coupon_code,
              order_amount: total,
            }),
          }
        );

        const data = await response.json();

        if (cancelled) {
          return;
        }

        // ==========================================
        // COUPON NO LONGER VALID
        // ==========================================

        if (!response.ok) {
          setCoupon(null);
          setCouponCode("");

          localStorage.removeItem(
            "hungryTownCoupon"
          );

          setCouponMessage(
            data.message ||
              "Coupon removed because your order amount is below the minimum required amount."
          );

          return;
        }

        // ==========================================
        // COUPON STILL VALID
        // ==========================================

        setCoupon(data.offer);

        setCouponCode(
          data.offer.coupon_code
        );

        localStorage.setItem(
          "hungryTownCoupon",
          JSON.stringify(data.offer)
        );

        setCouponMessage(
          `🎉 Coupon applied! You saved ₹${Number(
            data.discount
          ).toFixed(2)}.`
        );
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Coupon revalidation error:",
            error
          );
        }
      }
    };

    revalidateCoupon();

    return () => {
      cancelled = true;
    };
  }, [total, coupon?.coupon_code]);

  // =========================
  // CALCULATE DISCOUNT
  // =========================

  const discount = coupon
    ? coupon.discount_type ===
      "percentage"
      ? (total *
          Number(
            coupon.discount_value
          )) /
        100
      : Number(
          coupon.discount_value
        )
    : 0;

  // Discount cannot be greater than total
  const finalDiscount = Math.min(
    discount,
    total
  );

  const finalTotal = Math.max(
    total - finalDiscount,
    0
  );

  // =========================
  // APPLY COUPON
  // =========================

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage(
        "Please enter a coupon code."
      );
      return;
    }

    if (total <= 0) {
      setCouponMessage(
        "Your cart is empty."
      );
      return;
    }

    setCouponLoading(true);
    setCouponMessage("");

    try {
      const response = await fetch(
        "http://https://food-ordering-5v9t.onrender.com/api/offers/apply",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            coupon_code:
              couponCode.trim(),
            order_amount: total,
          }),
        }
      );

      const data =
        await response.json();

      // ==========================================
      // INVALID COUPON
      // ==========================================

      if (!response.ok) {
        setCoupon(null);

        localStorage.removeItem(
          "hungryTownCoupon"
        );

        setCouponMessage(
          data.message ||
            "Invalid coupon."
        );

        return;
      }

      // ==========================================
      // SAVE OFFER
      // ==========================================

      setCoupon(data.offer);

      setCouponCode(
        data.offer.coupon_code
      );

      // Save coupon for Checkout
      localStorage.setItem(
        "hungryTownCoupon",
        JSON.stringify(data.offer)
      );

      setCouponMessage(
        `🎉 Coupon applied successfully! You saved ₹${Number(
          data.discount
        ).toFixed(2)}.`
      );
    } catch (error) {
      console.error(
        "Coupon apply error:",
        error
      );

      setCoupon(null);

      localStorage.removeItem(
        "hungryTownCoupon"
      );

      setCouponMessage(
        "Unable to apply coupon. Please try again."
      );
    } finally {
      setCouponLoading(false);
    }
  };

  // =========================
  // REMOVE COUPON
  // =========================

  const removeCoupon = () => {
    setCoupon(null);

    setCouponCode("");

    setCouponMessage("");

    localStorage.removeItem(
      "hungryTownCoupon"
    );
  };

  // =========================
  // EMPTY CART
  // =========================

  if (cart.length === 0) {
    return (
      <div className="cart-page">

        <div className="cart-container empty-cart-container">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h1>
            Your Cart is Empty
          </h1>

          <p>
            Looks like you haven't
            added any delicious food yet.
          </p>

          <Link
            to="/menu"
            className="cart-main-button"
          >
            Explore Menu
          </Link>

        </div>

      </div>
    );
  }

  // =========================
  // CART PAGE
  // =========================

  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* CART TITLE */}

        <h1 className="cart-title">
          🛒 Your Cart
        </h1>

        <p className="cart-subtitle">
          Review your items before checkout
        </p>

        {/* SELECTED ITEMS */}

        <section className="cart-section">

          <h2>
            🍽️ Selected Items
          </h2>

          <div className="cart-items-list">

            {uniqueFoods.map((food) => {

              const quantity =
                getQuantity(food.id);

              return (
                <div
                  className="cart-item-card"
                  key={food.id}
                >

                  {/* FOOD DETAILS */}

                  <div className="cart-item-details">

                    <h3>
                      {food.name}
                    </h3>

                    <p>
                      ₹
                      {Number(
                        food.price
                      ).toFixed(2)}{" "}
                      per item
                    </p>

                    <strong>
                      ₹
                      {(
                        Number(
                          food.price
                        ) * quantity
                      ).toFixed(2)}
                    </strong>

                  </div>

                  {/* ACTIONS */}

                  <div className="cart-item-actions">

                    <div className="quantity-controls">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(
                            food.id
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(
                            food.id
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                    <button
                      type="button"
                      className="cart-remove-button"
                      onClick={() =>
                        removeFromCart(
                          food.id
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        </section>

        {/* COUPON SECTION */}

        <section className="cart-summary-section">

          <h2>
            🎟️ Apply Coupon
          </h2>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "15px",
            }}
          >

            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(event) =>
                setCouponCode(
                  event.target.value.toUpperCase()
                )
              }
              disabled={
                couponLoading ||
                coupon !== null
              }
              style={{
                flex: "1",
                minWidth: "200px",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "15px",
              }}
            />

            {!coupon ? (

              <button
                type="button"
                onClick={applyCoupon}
                disabled={couponLoading}
                className="cart-main-button"
              >
                {couponLoading
                  ? "Applying..."
                  : "Apply Coupon"}
              </button>

            ) : (

              <button
                type="button"
                onClick={removeCoupon}
                className="cart-remove-button"
              >
                Remove Coupon
              </button>

            )}

          </div>

          {/* COUPON MESSAGE */}

          {couponMessage && (
            <p
              style={{
                marginTop: "12px",
                fontWeight: "600",
              }}
            >
              {couponMessage}
            </p>
          )}

          {/* APPLIED COUPON */}

          {coupon && (
            <p
              style={{
                marginTop: "8px",
                color: "#16803c",
                fontWeight: "600",
              }}
            >
              Coupon Applied:{" "}
              {coupon.coupon_code}
            </p>
          )}

        </section>

        {/* ORDER SUMMARY */}

        <section className="cart-summary-section">

          <h2>
            📋 Order Summary
          </h2>

          {/* ITEMS */}

          <div className="summary-row">

            <span>
              Items
            </span>

            <span>
              {cart.length}
            </span>

          </div>

          {/* DELIVERY */}

          <div className="summary-row">

            <span>
              Delivery
            </span>

            <span className="free-delivery">
              FREE
            </span>

          </div>

          {/* SUBTOTAL */}

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <span>
              ₹{total.toFixed(2)}
            </span>

          </div>

          {/* DISCOUNT */}

          {coupon && (

            <div className="summary-row">

              <span>
                Coupon Discount
              </span>

              <span
                style={{
                  color: "#16803c",
                  fontWeight: "700",
                }}
              >
                -₹
                {finalDiscount.toFixed(2)}
              </span>

            </div>

          )}

          {/* FINAL TOTAL */}

          <div className="summary-total">

            <span>
              {coupon
                ? "Final Amount"
                : "Total Amount"}
            </span>

            <strong>
              ₹{finalTotal.toFixed(2)}
            </strong>

          </div>

        </section>

        {/* CART BUTTONS */}

        <div className="cart-page-buttons">

          <Link
            to="/menu"
            className="cart-secondary-button"
          >
            ← Continue Shopping
          </Link>

          <Link
            to="/checkout"
            className="cart-main-button"
          >
            Proceed to Checkout →
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Cart;