import {
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";

function Home() {
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] =
    useState(true);

  const features = [
    {
      icon: "🛵",
      title: "Fast Delivery",
      description:
        "Get your food delivered quickly",
    },
    {
      icon: "🍽️",
      title: "Quality Food",
      description:
        "Fresh and delicious meals",
    },
    {
      icon: "💳",
      title: "Easy Payment",
      description:
        "Safe and simple payments",
    },
    {
      icon: "❤️",
      title: "Happy Customers",
      description:
        "Made with love for you",
    },
  ];

  // =========================
  // FETCH ACTIVE OFFERS
  // =========================

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch(
        "http://https://food-ordering-5v9t.onrender.com/api/offers"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch offers"
        );
      }

      setOffers(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Offers fetch error:",
        error
      );

      setOffers([]);
    } finally {
      setOffersLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fffaf5",
        color: "#29221e",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      {/* =========================
          HERO SECTION
          ========================= */}

      <section
        style={{
          padding:
            "55px 7% 65px",
          background: "#fff8f1",
        }}
      >
        <div
          style={{
            maxWidth: "1250px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            alignItems: "center",
            gap: "55px",
          }}
        >
          {/* LEFT CONTENT */}

          <div>
            <div
              style={{
                display:
                  "inline-block",
                padding:
                  "10px 18px",
                borderRadius:
                  "25px",
                background:
                  "#fff0df",
                color:
                  "#f15b32",
                fontSize: "12px",
                fontWeight:
                  "bold",
                letterSpacing:
                  "0.5px",
                marginBottom:
                  "22px",
              }}
            >
              🍴 WELCOME TO HUNGRY TOWN
            </div>

            <h1
              style={{
                fontSize:
                  "clamp(38px, 4.5vw, 62px)",
                lineHeight:
                  "1.12",
                margin:
                  "0 0 22px",
                fontWeight:
                  "900",
                letterSpacing:
                  "-1.5px",
              }}
            >
              Delicious Food
              <br />

              <span
                style={{
                  color:
                    "#f45b32",
                }}
              >
                Delivered Fast
              </span>
            </h1>

            <p
              style={{
                maxWidth:
                  "430px",
                color:
                  "#81756d",
                fontSize: "15px",
                lineHeight:
                  "1.8",
                marginBottom:
                  "30px",
              }}
            >
              Enjoy tasty and fresh
              food from Hungry Town.
              Order your favourite
              meals and get them
              delivered directly to
              your doorstep.
            </p>

            <div
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: "18px",
                flexWrap:
                  "wrap",
              }}
            >
              <Link
                to="/menu"
                style={{
                  textDecoration:
                    "none",
                  background:
                    "#f45b32",
                  color:
                    "#ffffff",
                  padding:
                    "15px 28px",
                  borderRadius:
                    "8px",
                  fontSize:
                    "14px",
                  fontWeight:
                    "bold",
                  boxShadow:
                    "0 6px 15px rgba(244,91,50,0.18)",
                }}
              >
                Order Now →
              </Link>

              <span
                style={{
                  color:
                    "#746960",
                  fontSize:
                    "13px",
                }}
              >
                ⭐ 4.9 Customer Rating
              </span>
            </div>

            <div
              style={{
                display:
                  "flex",
                gap: "25px",
                flexWrap:
                  "wrap",
                marginTop:
                  "35px",
                color:
                  "#6e625a",
                fontSize:
                  "12px",
              }}
            >
              <span>
                ✓ Fresh Ingredients
              </span>

              <span>
                ✓ Hygienic Kitchen
              </span>

              <span>
                ✓ Quick Delivery
              </span>
            </div>
          </div>

          {/* RIGHT FOOD IMAGE */}

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "center",
              alignItems:
                "center",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth:
                  "480px",
                background:
                  "#ffffff",
                padding: "14px",
                borderRadius:
                  "20px",
                boxShadow:
                  "0 12px 35px rgba(70,45,25,0.10)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1000&q=90"
                alt="Delicious paneer Indian food"
                style={{
                  display:
                    "block",
                  width: "100%",
                  height:
                    "350px",
                  objectFit:
                    "cover",
                  borderRadius:
                    "14px",
                }}
              />

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  padding:
                    "17px 8px 5px",
                  gap: "10px",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin:
                        "0 0 5px",
                      fontSize:
                        "17px",
                      fontWeight:
                        "bold",
                    }}
                  >
                    Delicious Indian Food
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      fontSize:
                        "12px",
                      color:
                        "#91857c",
                    }}
                  >
                    Freshly prepared with love
                  </p>
                </div>

                <div
                  style={{
                    background:
                      "#fff1e5",
                    color:
                      "#f45b32",
                    padding:
                      "9px 12px",
                    borderRadius:
                      "8px",
                    fontSize:
                      "12px",
                    fontWeight:
                      "bold",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  🛵 25 mins
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          TODAY'S OFFERS
          ========================= */}

      <section
        style={{
          background:
            "#fffdfb",
          padding:
            "45px 7%",
          borderTop:
            "1px solid #f5e9df",
          borderBottom:
            "1px solid #f5e9df",
        }}
      >
        <div
          style={{
            maxWidth:
              "1250px",
            margin:
              "0 auto",
          }}
        >
          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap: "15px",
              flexWrap:
                "wrap",
              marginBottom:
                "25px",
            }}
          >
            <div>
              <h2
                style={{
                  margin:
                    "0 0 7px",
                  fontSize:
                    "28px",
                }}
              >
                🎁 Today's Offers
              </h2>

              <p
                style={{
                  margin: 0,
                  color:
                    "#8b7e75",
                  fontSize:
                    "14px",
                }}
              >
                Save more on your favourite food
              </p>
            </div>

            <Link
              to="/menu"
              style={{
                textDecoration:
                  "none",
                color:
                  "#f45b32",
                fontWeight:
                  "bold",
                fontSize:
                  "14px",
              }}
            >
              Order Now →
            </Link>
          </div>

          {offersLoading ? (
            <div
              style={{
                padding:
                  "25px",
                background:
                  "#ffffff",
                border:
                  "1px solid #eee",
                borderRadius:
                  "12px",
                color:
                  "#777",
              }}
            >
              Loading offers...
            </div>
          ) : offers.length ===
            0 ? (
            <div
              style={{
                padding:
                  "30px",
                background:
                  "#ffffff",
                border:
                  "1px solid #eee",
                borderRadius:
                  "12px",
                textAlign:
                  "center",
              }}
            >
              <div
                style={{
                  fontSize:
                    "35px",
                  marginBottom:
                    "10px",
                }}
              >
                🎁
              </div>

              <h3
                style={{
                  margin:
                    "0 0 7px",
                }}
              >
                No active offers right now
              </h3>

              <p
                style={{
                  margin: 0,
                  color:
                    "#888",
                  fontSize:
                    "14px",
                }}
              >
                Check back soon for exciting deals!
              </p>
            </div>
          ) : (
            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(270px, 1fr))",
                gap: "20px",
              }}
            >
              {offers.map(
                (offer) => (
                  <div
                    key={
                      offer.id
                    }
                    style={{
                      background:
                        "#ffffff",
                      border:
                        "1px solid #f1e3d8",
                      borderRadius:
                        "14px",
                      padding:
                        "22px",
                      boxShadow:
                        "0 5px 18px rgba(70,45,25,0.06)",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        marginBottom:
                          "15px",
                      }}
                    >
                      <span
                        style={{
                          fontSize:
                            "28px",
                        }}
                      >
                        🎁
                      </span>

                      <span
                        style={{
                          background:
                            "#fff0e4",
                          color:
                            "#f45b32",
                          padding:
                            "6px 10px",
                          borderRadius:
                            "20px",
                          fontSize:
                            "11px",
                          fontWeight:
                            "bold",
                        }}
                      >
                        LIMITED OFFER
                      </span>
                    </div>

                    <h3
                      style={{
                        margin:
                          "0 0 10px",
                        fontSize:
                          "19px",
                      }}
                    >
                      {
                        offer.offer_name
                      }
                    </h3>

                    <div
                      style={{
                        background:
                          "#fff7ed",
                        border:
                          "2px dashed #f45b32",
                        borderRadius:
                          "9px",
                        padding:
                          "12px",
                        textAlign:
                          "center",
                        marginBottom:
                          "15px",
                      }}
                    >
                      <div
                        style={{
                          fontSize:
                            "11px",
                          color:
                            "#888",
                          marginBottom:
                            "4px",
                        }}
                      >
                        USE CODE
                      </div>

                      <strong
                        style={{
                          color:
                            "#e85d04",
                          fontSize:
                            "20px",
                          letterSpacing:
                            "1px",
                        }}
                      >
                        {
                          offer.coupon_code
                        }
                      </strong>
                    </div>

                    <p
                      style={{
                        margin:
                          "8px 0",
                        fontSize:
                          "14px",
                      }}
                    >
                      <strong>
                        Save:
                      </strong>{" "}
                      {offer.discount_type ===
                      "percentage"
                        ? `${offer.discount_value}% OFF`
                        : `₹${Number(
                            offer.discount_value
                          ).toFixed(
                            0
                          )} OFF`}
                    </p>

                    <p
                      style={{
                        margin:
                          "8px 0",
                        fontSize:
                          "13px",
                        color:
                          "#777",
                      }}
                    >
                      On orders above ₹
                      {Number(
                        offer.minimum_order_amount ||
                          0
                      ).toFixed(
                        0
                      )}
                    </p>

                    <Link
                      to="/menu"
                      style={{
                        display:
                          "block",
                        textAlign:
                          "center",
                        textDecoration:
                          "none",
                        background:
                          "#f45b32",
                        color:
                          "#ffffff",
                        padding:
                          "11px",
                        borderRadius:
                          "7px",
                        marginTop:
                          "18px",
                        fontSize:
                          "14px",
                        fontWeight:
                          "bold",
                      }}
                    >
                      Order & Save →
                    </Link>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* =========================
          FEATURES SECTION
          ========================= */}

      <section
        style={{
          background:
            "#ffffff",
          padding:
            "42px 7%",
          borderTop:
            "1px solid #f5e9df",
        }}
      >
        <div
          style={{
            maxWidth:
              "1250px",
            margin:
              "0 auto",
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "20px",
          }}
        >
          {features.map(
            (feature) => (
              <div
                key={
                  feature.title
                }
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: "14px",
                  padding:
                    "18px",
                  border:
                    "1px solid #f1e8e0",
                  borderRadius:
                    "12px",
                  background:
                    "#fffdfb",
                }}
              >
                <div
                  style={{
                    width:
                      "50px",
                    height:
                      "50px",
                    flexShrink:
                      0,
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    borderRadius:
                      "10px",
                    background:
                      "#fff0e4",
                    fontSize:
                      "23px",
                  }}
                >
                  {
                    feature.icon
                  }
                </div>

                <div>
                  <h3
                    style={{
                      margin:
                        "0 0 6px",
                      fontSize:
                        "14px",
                      fontWeight:
                        "bold",
                    }}
                  >
                    {
                      feature.title
                    }
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color:
                        "#958980",
                      fontSize:
                        "11px",
                      lineHeight:
                        "1.5",
                    }}
                  >
                    {
                      feature.description
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* =========================
          RESPONSIVE STYLE
          ========================= */}

      <style>
        {`
          @media (max-width: 850px) {
            section > div {
              grid-template-columns: 1fr !important;
            }

            img {
              height: 280px !important;
            }
          }

          @media (max-width: 500px) {
            h1 {
              font-size: 38px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Home;