const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

const PORT = 5000;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// MYSQL CONNECTION
// =====================================================

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "food_ordering",
});

db.connect((error) => {
  if (error) {
    console.error(
      "MySQL connection failed:",
      error.message
    );
    return;
  }

  console.log(
    "MySQL connected successfully"
  );
});

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message:
      "Hungry Town backend is running",
  });
});

// =====================================================
// GET FOODS
// =====================================================

app.get("/api/foods", (req, res) => {
  const sql = `
    SELECT *
    FROM foods
    ORDER BY id ASC
  `;

  db.query(sql, (error, results) => {
    if (error) {
      console.error(
        "Foods fetch error:",
        error
      );

      return res.status(500).json({
        message: "Failed to fetch foods",
      });
    }

    res.json(results);
  });
});

// =====================================================
// SIGNUP
// =====================================================

app.post("/api/signup", (req, res) => {
  const {
    name,
    email,
    password,
  } = req.body;

  if (
    !name ||
    !email ||
    !password
  ) {
    return res.status(400).json({
      message:
        "All fields are required",
    });
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must contain uppercase, lowercase, number, special character and minimum 8 characters",
    });
  }

  const checkSql = `
    SELECT id
    FROM users
    WHERE email = ?
  `;

  db.query(
    checkSql,
    [email],
    (checkError, existingUsers) => {
      if (checkError) {
        console.error(
          "Signup check error:",
          checkError
        );

        return res.status(500).json({
          message:
            "Failed to check user",
        });
      }

      if (existingUsers.length > 0) {
        return res.status(409).json({
          message:
            "Email already registered",
        });
      }

      const insertSql = `
        INSERT INTO users
        (name, email, password)
        VALUES (?, ?, ?)
      `;

      db.query(
        insertSql,
        [name, email, password],
        (insertError, result) => {
          if (insertError) {
            console.error(
              "Signup insert error:",
              insertError
            );

            return res.status(500).json({
              message:
                "Failed to create account",
            });
          }

          res.status(201).json({
            message:
              "Account created successfully",
            userId: result.insertId,
          });
        }
      );
    }
  );
});

// =====================================================
// LOGIN
// =====================================================

app.post("/api/login", (req, res) => {
  const {
    email,
    password,
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message:
        "Email and password are required",
    });
  }

  const sql = `
    SELECT id, name, email
    FROM users
    WHERE email = ?
      AND password = ?
  `;

  db.query(
    sql,
    [email, password],
    (error, results) => {
      if (error) {
        console.error(
          "Login error:",
          error
        );

        return res.status(500).json({
          message:
            "Login failed",
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }

      res.json({
        message:
          "Login successful",
        user: results[0],
      });
    }
  );
});

// =====================================================
// CREATE ORDER
// =====================================================

app.post("/api/orders", (req, res) => {
  const {
    user_id,
    customer_name,
    mobile,
    address,
    original_amount,
    coupon_code,
    discount_amount,
    total_amount,
    items,
  } = req.body;

  if (
    !user_id ||
    !customer_name ||
    !mobile ||
    !address ||
    total_amount ===
      undefined ||
    total_amount === null
  ) {
    return res.status(400).json({
      message:
        "All fields are required",
    });
  }

  if (
    !items ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      message:
        "Order items are required",
    });
  }

  const finalOriginalAmount =
    original_amount !==
      undefined &&
    original_amount !== null
      ? Number(original_amount)
      : Number(total_amount);

  const finalDiscountAmount =
    discount_amount !==
      undefined &&
    discount_amount !== null
      ? Number(discount_amount)
      : 0;

  const finalCouponCode =
    coupon_code &&
    coupon_code.trim()
      ? coupon_code
          .trim()
          .toUpperCase()
      : null;

  const finalTotalAmount =
    Number(total_amount);

  const orderSql = `
    INSERT INTO orders
    (
      user_id,
      customer_name,
      mobile,
      address,
      original_amount,
      coupon_code,
      discount_amount,
      total_amount,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const orderValues = [
    user_id,
    customer_name,
    mobile,
    address,
    finalOriginalAmount,
    finalCouponCode,
    finalDiscountAmount,
    finalTotalAmount,
    "Pending",
  ];

  db.query(
    orderSql,
    orderValues,
    (orderError, orderResult) => {
      if (orderError) {
        console.error(
          "Order insert error:",
          orderError
        );

        return res.status(500).json({
          message:
            "Failed to create order",
        });
      }

      const orderId =
        orderResult.insertId;

      const itemSql = `
        INSERT INTO order_items
        (
          order_id,
          food_id,
          food_name,
          quantity,
          price
        )
        VALUES ?
      `;

      const itemValues =
        items.map((item) => [
          orderId,
          item.food_id ||
            item.id,
          item.food_name ||
            item.name,
          Number(
            item.quantity
          ) || 1,
          Number(
            item.price
          ) || 0,
        ]);

      db.query(
        itemSql,
        [itemValues],
        (itemError) => {
          if (itemError) {
            console.error(
              "Order items insert error:",
              itemError
            );

            return res.status(500).json({
              message:
                "Order created but failed to save order items",
            });
          }

          if (finalCouponCode) {
            const couponSql = `
              UPDATE offers
              SET used_count =
                used_count + 1
              WHERE coupon_code = ?
                AND is_active = TRUE
            `;

            db.query(
              couponSql,
              [finalCouponCode],
              (couponError) => {
                if (couponError) {
                  console.error(
                    "Coupon usage update error:",
                    couponError
                  );
                }

                return res.status(201).json({
                  message:
                    "Order placed successfully",

                  orderId,

                  original_amount:
                    finalOriginalAmount,

                  coupon_code:
                    finalCouponCode,

                  discount_amount:
                    finalDiscountAmount,

                  total_amount:
                    finalTotalAmount,

                  status:
                    "Pending",
                });
              }
            );
          } else {
            return res.status(201).json({
              message:
                "Order placed successfully",

              orderId,

              original_amount:
                finalOriginalAmount,

              coupon_code: null,

              discount_amount: 0,

              total_amount:
                finalTotalAmount,

              status:
                "Pending",
            });
          }
        }
      );
    }
  );
});

// =====================================================
// GET ALL ORDERS - ADMIN
// =====================================================

app.get("/api/orders", (req, res) => {
  const sql = `
    SELECT *
    FROM orders
    ORDER BY id DESC
  `;

  db.query(sql, (error, results) => {
    if (error) {
      console.error(
        "Orders fetch error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch orders",
      });
    }

    res.json(results);
  });
});

// =====================================================
// GET USER ORDERS
// =====================================================

app.get(
  "/api/users/:userId/orders",
  (req, res) => {
    const userId =
      req.params.userId;

    const sql = `
      SELECT *
      FROM orders
      WHERE user_id = ?
      ORDER BY id DESC
    `;

    db.query(
      sql,
      [userId],
      (error, results) => {
        if (error) {
          console.error(
            "User orders fetch error:",
            error
          );

          return res.status(500).json({
            message:
              "Failed to fetch user orders",
          });
        }

        res.json(results);
      }
    );
  }
);

// =====================================================
// GET ORDER ITEMS
// =====================================================

app.get(
  "/api/orders/:orderId/items",
  (req, res) => {
    const orderId =
      req.params.orderId;

    const sql = `
      SELECT *
      FROM order_items
      WHERE order_id = ?
      ORDER BY id ASC
    `;

    db.query(
      sql,
      [orderId],
      (error, results) => {
        if (error) {
          console.error(
            "Order items fetch error:",
            error
          );

          return res.status(500).json({
            message:
              "Failed to fetch order items",
          });
        }

        res.json(results);
      }
    );
  }
);

// =====================================================
// UPDATE ORDER STATUS - ADMIN
// =====================================================

app.put(
  "/api/orders/:orderId/status",
  (req, res) => {
    const orderId =
      req.params.orderId;

    const { status } =
      req.body;

    const allowedStatuses = [
      "Pending",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid order status",
      });
    }

    const sql = `
      UPDATE orders
      SET status = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [status, orderId],
      (error, result) => {
        if (error) {
          console.error(
            "Order status update error:",
            error
          );

          return res.status(500).json({
            message:
              "Failed to update order status",
          });
        }

        if (
          result.affectedRows === 0
        ) {
          return res.status(404).json({
            message:
              "Order not found",
          });
        }

        res.json({
          message:
            "Order status updated successfully",
          orderId,
          status,
        });
      }
    );
  }
);

// =====================================================
// USER CANCEL ORDER
// =====================================================

app.put(
  "/api/orders/:orderId/cancel",
  (req, res) => {
    const orderId =
      req.params.orderId;

    const userId =
      req.body.user_id;

    if (!userId) {
      return res.status(400).json({
        message:
          "User ID is required",
      });
    }

    const findSql = `
      SELECT
        id,
        user_id,
        status
      FROM orders
      WHERE id = ?
        AND user_id = ?
    `;

    db.query(
      findSql,
      [orderId, userId],
      (findError, results) => {
        if (findError) {
          console.error(
            "Cancel order find error:",
            findError
          );

          return res.status(500).json({
            message:
              "Failed to find order",
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            message:
              "Order not found",
          });
        }

        const order =
          results[0];

        // User can cancel only before
        // Out for Delivery / Delivered.
        const cancellableStatuses = [
          "Pending",
          "Preparing",
        ];

        if (
          !cancellableStatuses.includes(
            order.status
          )
        ) {
          return res.status(400).json({
            message:
              "This order can no longer be cancelled.",
          });
        }

        const updateSql = `
          UPDATE orders
          SET status = 'Cancelled'
          WHERE id = ?
            AND user_id = ?
            AND status IN ('Pending', 'Preparing')
        `;

        db.query(
          updateSql,
          [orderId, userId],
          (updateError, updateResult) => {
            if (updateError) {
              console.error(
                "Cancel order update error:",
                updateError
              );

              return res.status(500).json({
                message:
                  "Failed to cancel order",
              });
            }

            if (
              updateResult.affectedRows ===
              0
            ) {
              return res.status(400).json({
                message:
                  "Order cannot be cancelled now.",
              });
            }

            res.json({
              success: true,
              message:
                "Order cancelled successfully",
              orderId,
              status:
                "Cancelled",
            });
          }
        );
      }
    );
  }
);

// =====================================================
// SUGGESTIONS
// =====================================================

app.post(
  "/api/suggestions",
  (req, res) => {
    const {
      user_id,
      user_name,
      user_email,
      suggestion,
    } = req.body;

    if (
      !user_id ||
      !user_name ||
      !user_email ||
      !suggestion
    ) {
      return res.status(400).json({
        message:
          "All fields are required",
      });
    }

    const sql = `
      INSERT INTO suggestions
      (
        user_id,
        user_name,
        user_email,
        suggestion
      )
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        user_id,
        user_name,
        user_email,
        suggestion,
      ],
      (error, result) => {
        if (error) {
          console.error(
            "Suggestion insert error:",
            error
          );

          return res.status(500).json({
            message:
              "Failed to save suggestion",
          });
        }

        res.status(201).json({
          message:
            "Suggestion submitted successfully",
          id: result.insertId,
        });
      }
    );
  }
);

app.get(
  "/api/suggestions",
  (req, res) => {
    const sql = `
      SELECT *
      FROM suggestions
      ORDER BY created_at DESC
    `;

    db.query(
      sql,
      (error, results) => {
        if (error) {
          console.error(
            "Suggestions fetch error:",
            error
          );

          return res.status(500).json({
            message:
              "Failed to fetch suggestions",
          });
        }

        res.json(results);
      }
    );
  }
);

// =====================================================
// GET ACTIVE OFFERS - USER
// =====================================================

app.get(
  "/api/offers",
  (req, res) => {
    const sql = `
      SELECT *
      FROM offers
      WHERE is_active = TRUE
        AND start_date <= NOW()
        AND end_date >= NOW()
      ORDER BY created_at DESC
    `;

    db.query(
      sql,
      (error, results) => {
        if (error) {
          console.error(
            "Offers fetch error:",
            error
          );

          return res.status(500).json({
            message:
              "Failed to fetch offers",
          });
        }

        res.json(results);
      }
    );
  }
);

// =====================================================
// GET ALL OFFERS - ADMIN
// =====================================================

app.get(
  "/api/admin/offers",
  (req, res) => {
    const sql = `
      SELECT *
      FROM offers
      ORDER BY created_at DESC
    `;

    db.query(
      sql,
      (error, results) => {
        if (error) {
          console.error(
            "Admin offers fetch error:",
            error
          );

          return res.status(500).json({
            message:
              "Failed to fetch admin offers",
          });
        }

        res.json(results);
      }
    );
  }
);

// =====================================================
// CREATE OFFER
// =====================================================

app.post(
  "/api/offers",
  (req, res) => {
    const {
      offer_name,
      coupon_code,
      discount_type,
      discount_value,
      minimum_order_amount,
      start_date,
      end_date,
      maximum_uses,
    } = req.body;

    if (
      !offer_name ||
      !coupon_code ||
      !discount_type ||
      discount_value ===
        undefined ||
      !start_date ||
      !end_date
    ) {
      return res.status(400).json({
        message:
          "Required offer fields are missing",
      });
    }

    if (
      !["flat", "percentage"].includes(
        discount_type
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid discount type",
      });
    }

    const discountValue =
      Number(discount_value);

    if (
      Number.isNaN(
        discountValue
      ) ||
      discountValue <= 0
    ) {
      return res.status(400).json({
        message:
          "Discount value must be greater than 0",
      });
    }

    if (
      discount_type ===
        "percentage" &&
      discountValue > 100
    ) {
      return res.status(400).json({
        message:
          "Percentage discount cannot exceed 100",
      });
    }

    if (
      new Date(start_date) >=
      new Date(end_date)
    ) {
      return res.status(400).json({
        message:
          "End date must be after start date",
      });
    }

    const checkSql = `
      SELECT id
      FROM offers
      WHERE coupon_code = ?
    `;

    db.query(
      checkSql,
      [
        coupon_code
          .trim()
          .toUpperCase(),
      ],
      (checkError, existing) => {
        if (checkError) {
          console.error(
            "Offer duplicate check error:",
            checkError
          );

          return res.status(500).json({
            message:
              "Failed to check coupon",
          });
        }

        if (existing.length > 0) {
          return res.status(409).json({
            message:
              "Coupon code already exists",
          });
        }

        const sql = `
          INSERT INTO offers
          (
            offer_name,
            coupon_code,
            discount_type,
            discount_value,
            minimum_order_amount,
            start_date,
            end_date,
            maximum_uses,
            used_count,
            is_active
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, TRUE)
        `;

        db.query(
          sql,
          [
            offer_name.trim(),
            coupon_code
              .trim()
              .toUpperCase(),
            discount_type,
            discountValue,
            Number(
              minimum_order_amount
            ) || 0,
            start_date,
            end_date,
            maximum_uses
              ? Number(
                  maximum_uses
                )
              : null,
          ],
          (insertError, result) => {
            if (insertError) {
              console.error(
                "Offer insert error:",
                insertError
              );

              return res.status(500).json({
                message:
                  "Failed to create offer",
              });
            }

            res.status(201).json({
              message:
                "Offer created successfully",
              id: result.insertId,
            });
          }
        );
      }
    );
  }
);

// =====================================================
// UPDATE OFFER
// =====================================================

app.put(
  "/api/offers/:id",
  (req, res) => {
    const offerId =
      req.params.id;

    const {
      offer_name,
      coupon_code,
      discount_type,
      discount_value,
      minimum_order_amount,
      start_date,
      end_date,
      maximum_uses,
      is_active,
    } = req.body;

    if (
      !offer_name ||
      !coupon_code ||
      !discount_type ||
      discount_value ===
        undefined ||
      !start_date ||
      !end_date
    ) {
      return res.status(400).json({
        message:
          "Required offer fields are missing",
      });
    }

    if (
      !["flat", "percentage"].includes(
        discount_type
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid discount type",
      });
    }

    const discountValue =
      Number(discount_value);

    if (
      Number.isNaN(
        discountValue
      ) ||
      discountValue <= 0
    ) {
      return res.status(400).json({
        message:
          "Discount value must be greater than 0",
      });
    }

    if (
      discount_type ===
        "percentage" &&
      discountValue > 100
    ) {
      return res.status(400).json({
        message:
          "Percentage discount cannot exceed 100",
      });
    }

    if (
      new Date(start_date) >=
      new Date(end_date)
    ) {
      return res.status(400).json({
        message:
          "End date must be after start date",
      });
    }

    const checkSql = `
      SELECT id
      FROM offers
      WHERE coupon_code = ?
        AND id != ?
    `;

    db.query(
      checkSql,
      [
        coupon_code
          .trim()
          .toUpperCase(),
        offerId,
      ],
      (checkError, existing) => {
        if (checkError) {
          console.error(
            "Offer update duplicate check error:",
            checkError
          );

          return res.status(500).json({
            message:
              "Failed to check coupon",
          });
        }

        if (existing.length > 0) {
          return res.status(409).json({
            message:
              "Coupon code already exists",
          });
        }

        const activeValue =
          typeof is_active ===
          "boolean"
            ? is_active
            : true;

        const sql = `
          UPDATE offers
          SET
            offer_name = ?,
            coupon_code = ?,
            discount_type = ?,
            discount_value = ?,
            minimum_order_amount = ?,
            start_date = ?,
            end_date = ?,
            maximum_uses = ?,
            is_active = ?
          WHERE id = ?
        `;

        db.query(
          sql,
          [
            offer_name.trim(),

            coupon_code
              .trim()
              .toUpperCase(),

            discount_type,

            discountValue,

            Number(
              minimum_order_amount
            ) || 0,

            start_date,

            end_date,

            maximum_uses
              ? Number(
                  maximum_uses
                )
              : null,

            activeValue,

            offerId,
          ],
          (updateError, result) => {
            if (updateError) {
              console.error(
                "Offer update error:",
                updateError
              );

              return res.status(500).json({
                message:
                  "Failed to update offer",
              });
            }

            if (
              result.affectedRows ===
              0
            ) {
              return res.status(404).json({
                message:
                  "Offer not found",
              });
            }

            res.json({
              message:
                "Offer updated successfully",
            });
          }
        );
      }
    );
  }
);

// =====================================================
// DELETE OFFER
// =====================================================

app.delete(
  "/api/offers/:id",
  (req, res) => {
    const offerId =
      req.params.id;

    const sql = `
      DELETE FROM offers
      WHERE id = ?
    `;

    db.query(
      sql,
      [offerId],
      (error, result) => {
        if (error) {
          console.error(
            "Offer delete error:",
            error
          );

          return res.status(500).json({
            message:
              "Failed to delete offer",
          });
        }

        if (
          result.affectedRows ===
          0
        ) {
          return res.status(404).json({
            message:
              "Offer not found",
          });
        }

        res.json({
          message:
            "Offer deleted successfully",
        });
      }
    );
  }
);

// =====================================================
// APPLY COUPON
// =====================================================

app.post(
  "/api/offers/apply",
  (req, res) => {
    const {
      coupon_code,
      order_amount,
    } = req.body;

    if (
      !coupon_code ||
      order_amount ===
        undefined
    ) {
      return res.status(400).json({
        message:
          "Coupon code and order amount are required",
      });
    }

    const amount =
      Number(order_amount);

    const sql = `
      SELECT *
      FROM offers
      WHERE coupon_code = ?
        AND is_active = TRUE
        AND start_date <= NOW()
        AND end_date >= NOW()
      LIMIT 1
    `;

    db.query(
      sql,
      [
        coupon_code
          .trim()
          .toUpperCase(),
      ],
      (error, results) => {
        if (error) {
          console.error(
            "Coupon apply error:",
            error
          );

          return res.status(500).json({
            message:
              "Failed to apply coupon",
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            message:
              "Invalid or expired coupon",
          });
        }

        const offer =
          results[0];

        if (
          offer.maximum_uses !==
            null &&
          offer.used_count >=
            offer.maximum_uses
        ) {
          return res.status(400).json({
            message:
              "Coupon usage limit reached",
          });
        }

        if (
          amount <
          Number(
            offer.minimum_order_amount
          )
        ) {
          return res.status(400).json({
            message:
              `Minimum order amount is ₹${offer.minimum_order_amount}`,
          });
        }

        let discount = 0;

        if (
          offer.discount_type ===
          "percentage"
        ) {
          discount =
            (amount *
              Number(
                offer.discount_value
              )) /
            100;
        } else {
          discount =
            Number(
              offer.discount_value
            );
        }

        if (
          discount > amount
        ) {
          discount = amount;
        }

        const finalAmount =
          amount - discount;

        res.json({
          success: true,

          message:
            "Coupon applied successfully",

          offer: {
            id: offer.id,

            offer_name:
              offer.offer_name,

            coupon_code:
              offer.coupon_code,

            discount_type:
              offer.discount_type,

            discount_value:
              offer.discount_value,
          },

          orderAmount: amount,

          discount: Number(
            discount.toFixed(2)
          ),

          finalAmount: Number(
            finalAmount.toFixed(2)
          ),
        });
      }
    );
  }
);

// =====================================================
// USE OFFER
// =====================================================

app.post(
  "/api/offers/use/:id",
  (req, res) => {
    const offerId =
      req.params.id;

    const sql = `
      UPDATE offers
      SET used_count =
        used_count + 1
      WHERE id = ?
        AND is_active = TRUE
        AND (
          maximum_uses IS NULL
          OR used_count < maximum_uses
        )
    `;

    db.query(
      sql,
      [offerId],
      (error, result) => {
        if (error) {
          console.error(
            "Offer usage error:",
            error
          );

          return res.status(500).json({
            message:
              "Failed to update offer usage",
          });
        }

        if (
          result.affectedRows ===
          0
        ) {
          return res.status(400).json({
            message:
              "Offer usage limit reached or offer inactive",
          });
        }

        res.json({
          message:
            "Offer usage updated successfully",
        });
      }
    );
  }
);

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `Hungry Town server running on http://localhost:${PORT}`
  );
});