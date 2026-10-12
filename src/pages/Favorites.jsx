import { useEffect, useState } from "react";

const specialImages = {
  "farmhouse pizza":
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=700&auto=format&fit=crop",

  chapati:
    "https://images.unsplash.com/photo-1610057099431-d0c005d5b7b4?w=700&auto=format&fit=crop",

  roti:
    "https://images.unsplash.com/photo-1610057099431-d0c005d5b7b4?w=700&auto=format&fit=crop",
};

function Favorites({ addToCart }) {
  const [favorites, setFavorites] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [loadingImages, setLoadingImages] = useState({});

  // =====================================
  // GET LOGGED-IN USER
  // =====================================

  const getFavoriteKey = () => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      const user = JSON.parse(savedUser);

      if (!user || !user.id) {
        return null;
      }

      return `favoriteFoods_${user.id}`;
    } catch (error) {
      console.error("Invalid user data:", error);
      return null;
    }
  };

  // =====================================
  // LOAD FAVORITES
  // =====================================

  useEffect(() => {
    const favoriteKey = getFavoriteKey();

    if (!favoriteKey) {
      setFavorites([]);
      return;
    }

    const savedFavorites =
      JSON.parse(
        localStorage.getItem(favoriteKey)
      ) || [];

    setFavorites(savedFavorites);
  }, []);

  // =====================================
  // LOAD FOOD IMAGES
  // =====================================

  useEffect(() => {
    let active = true;

    async function loadImages() {
      for (const food of favorites) {
        const foodName = String(food.name || "")
          .trim()
          .toLowerCase();

        // Special image
        if (specialImages[foodName]) {
          if (active) {
            setImageUrls((previous) => ({
              ...previous,
              [food.id]: specialImages[foodName],
            }));
          }

          continue;
        }

        // Saved image
        const savedImage =
          food.imageUrl ||
          food.image_url ||
          food.image ||
          "";

        if (savedImage) {
          if (active) {
            setImageUrls((previous) => ({
              ...previous,
              [food.id]: savedImage,
            }));
          }

          continue;
        }

        try {
          if (active) {
            setLoadingImages((previous) => ({
              ...previous,
              [food.id]: true,
            }));
          }

          const apiUrl =
            "https://commons.wikimedia.org/w/api.php" +
            "?action=query" +
            "&generator=search" +
            `&gsrsearch=${encodeURIComponent(
              food.name + " food"
            )}` +
            "&gsrnamespace=6" +
            "&gsrlimit=10" +
            "&prop=imageinfo" +
            "&iiprop=url" +
            "&iiurlwidth=700" +
            "&format=json" +
            "&origin=*";

          const response =
            await fetch(apiUrl);

          const data =
            await response.json();

          const pages = data.query?.pages
            ? Object.values(data.query.pages)
            : [];

          const imagePage =
            pages.find((page) => {
              const info =
                page.imageinfo?.[0];

              if (
                !info?.thumburl &&
                !info?.url
              ) {
                return false;
              }

              const title =
                page.title.toLowerCase();

              return (
                !title.endsWith(".svg") &&
                !title.endsWith(".gif")
              );
            });

          if (
            active &&
            imagePage
          ) {
            const info =
              imagePage.imageinfo[0];

            setImageUrls((previous) => ({
              ...previous,
              [food.id]:
                info.thumburl ||
                info.url,
            }));
          }
        } catch (error) {
          console.error(
            "Favorite image error:",
            error
          );
        } finally {
          if (active) {
            setLoadingImages((previous) => ({
              ...previous,
              [food.id]: false,
            }));
          }
        }
      }
    }

    if (favorites.length > 0) {
      loadImages();
    }

    return () => {
      active = false;
    };
  }, [favorites]);

  // =====================================
  // REMOVE FAVORITE
  // =====================================

  function removeFavorite(foodId) {
    const favoriteKey = getFavoriteKey();

    if (!favoriteKey) {
      return;
    }

    const updatedFavorites =
      favorites.filter(
        (food) => food.id !== foodId
      );

    localStorage.setItem(
      favoriteKey,
      JSON.stringify(updatedFavorites)
    );

    setFavorites(updatedFavorites);
  }

  // =====================================
  // ADD TO CART
  // =====================================

  function handleAddToCart(food) {
    addToCart(food);

    alert(
      food.name +
        " added to cart!"
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div
      style={{
        minHeight: "70vh",
        padding: "40px 20px",
        maxWidth: "1250px",
        margin: "auto",
      }}
    >
      {/* PAGE HEADER */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "35px",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            color: "#222",
            marginBottom: "10px",
          }}
        >
          ❤️ My Favorite Foods
        </h1>

        <p
          style={{
            color: "#777",
            fontSize: "16px",
          }}
        >
          Your favorite flavors, all in one place!
        </p>
      </div>

      {/* EMPTY FAVORITES */}

      {favorites.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "70px 20px",
            background: "#fff8f0",
            borderRadius: "18px",
            border: "1px solid #ffe0c2",
          }}
        >
          <div
            style={{
              fontSize: "60px",
              marginBottom: "15px",
            }}
          >
            ❤️
          </div>

          <h2
            style={{
              color: "#333",
              marginBottom: "10px",
            }}
          >
            No favorite foods yet
          </h2>

          <p style={{ color: "#777" }}>
            Go to the Menu and add your favorite foods!
          </p>
        </div>
      ) : (
        <>
          {/* FAVORITES COUNT */}

          <p
            style={{
              fontSize: "17px",
              color: "#555",
              marginBottom: "20px",
            }}
          >
            You have{" "}
            <strong>
              {favorites.length}
            </strong>{" "}
            favorite food
            {favorites.length > 1 ? "s" : ""}
          </p>

          {/* FOOD CARDS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "25px",
            }}
          >
            {favorites.map((food) => {
              const imageUrl =
                imageUrls[food.id];

              const isLoading =
                loadingImages[food.id];

              return (
                <div
                  key={food.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    overflow: "hidden",
                    border:
                      "1px solid #eeeeee",
                    boxShadow:
                      "0 5px 18px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  {/* FOOD IMAGE */}

                  <div
                    style={{
                      height: "190px",
                      background:
                        "linear-gradient(135deg, #fff0df, #ffe0c2)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    {isLoading ? (
                      <span
                        style={{
                          color: "#777",
                        }}
                      >
                        Loading...
                      </span>
                    ) : imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={food.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: "70px",
                        }}
                      >
                        🍽️
                      </span>
                    )}
                  </div>

                  {/* FOOD DETAILS */}

                  <div
                    style={{
                      padding: "20px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "21px",
                        color: "#222",
                        marginBottom: "8px",
                      }}
                    >
                      {food.name}
                    </h2>

                    {food.category && (
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#888",
                          marginBottom: "10px",
                        }}
                      >
                        {food.category}
                      </p>
                    )}

                    <p
                      style={{
                        fontSize: "21px",
                        fontWeight: "bold",
                        color: "#198754",
                        marginBottom: "18px",
                      }}
                    >
                      ₹
                      {Number(
                        food.price
                      ).toFixed(2)}
                    </p>

                    {/* ADD TO CART */}

                    <button
                      onClick={() =>
                        handleAddToCart(food)
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "10px",
                        border: "none",
                        borderRadius: "8px",
                        background:
                          "linear-gradient(135deg, #198754, #157347)",
                        color: "white",
                        fontSize: "15px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      🛒 Add to Cart
                    </button>

                    {/* REMOVE FAVORITE */}

                    <button
                      onClick={() =>
                        removeFavorite(food.id)
                      }
                      style={{
                        width: "100%",
                        padding: "11px",
                        border:
                          "1px solid #dc3545",
                        borderRadius: "8px",
                        background: "#ffffff",
                        color: "#dc3545",
                        fontSize: "14px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      💔 Remove Favorite
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Favorites;