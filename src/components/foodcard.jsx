import { useEffect, useState } from "react";

const specialImages = {
  "farmhouse pizza":
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=700&auto=format&fit=crop",

  chapati:
    "https://images.unsplash.com/photo-1610057099431-d0c005d5b7b4?w=700&auto=format&fit=crop",

  roti:
    "https://images.unsplash.com/photo-1610057099431-d0c005d5b7b4?w=700&auto=format&fit=crop",
};

function FoodCard({ food, addToCart }) {
  const foodName = String(food.name || "")
    .trim()
    .toLowerCase();

  const [imageUrl, setImageUrl] = useState(
    specialImages[foodName] || ""
  );

  const [loading, setLoading] = useState(
    !specialImages[foodName]
  );

  // =====================================
  // GET CURRENT LOGGED-IN USER
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
      console.error(
        "Invalid user data:",
        error
      );

      return null;
    }
  };

  // =====================================
  // FAVORITE STATE
  // =====================================

  const [isFavorite, setIsFavorite] = useState(() => {
    const favoriteKey = getFavoriteKey();

    if (!favoriteKey) {
      return false;
    }

    const savedFavorites =
      JSON.parse(
        localStorage.getItem(favoriteKey)
      ) || [];

    return savedFavorites.some(
      (favoriteFood) =>
        favoriteFood.id === food.id
    );
  });

  // =====================================
  // LOAD FOOD IMAGE
  // =====================================

  useEffect(() => {
    let active = true;

    if (specialImages[foodName]) {
      setImageUrl(
        specialImages[foodName]
      );

      setLoading(false);

      return;
    }

    async function loadFoodImage() {
      try {
        setLoading(true);

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
          ? Object.values(
              data.query.pages
            )
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

          setImageUrl(
            info.thumburl ||
              info.url
          );
        }
      } catch (error) {
        console.error(
          "Food image error:",
          error
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFoodImage();

    return () => {
      active = false;
    };
  }, [food.name, foodName]);

  // =====================================
  // ADD TO CART
  // =====================================

  function handleAddToCart() {
    addToCart(food);

    alert(
      food.name +
        " added to cart!"
    );
  }

  // =====================================
  // TOGGLE FAVORITE
  // =====================================

  function handleFavorite() {
    const favoriteKey =
      getFavoriteKey();

    // User is not logged in
    if (!favoriteKey) {
      alert(
        "Please login to use Favorites."
      );

      return;
    }

    const savedFavorites =
      JSON.parse(
        localStorage.getItem(
          favoriteKey
        )
      ) || [];

    if (isFavorite) {
      // REMOVE FAVORITE

      const updatedFavorites =
        savedFavorites.filter(
          (favoriteFood) =>
            favoriteFood.id !==
            food.id
        );

      localStorage.setItem(
        favoriteKey,
        JSON.stringify(
          updatedFavorites
        )
      );

      setIsFavorite(false);
    } else {
      // ADD FAVORITE

      const updatedFavorites = [
        ...savedFavorites,
        food,
      ];

      localStorage.setItem(
        favoriteKey,
        JSON.stringify(
          updatedFavorites
        )
      );

      setIsFavorite(true);
    }
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div className="food-card">
      <div className="food-image-container">

        {loading ? (
          <div className="image-loading">
            Loading...
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={food.name}
            className="food-image-real"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display =
                "none";
            }}
          />
        ) : (
          <div className="image-fallback">
            🍽️
          </div>
        )}

        <span className="food-veg-badge">
          ●
        </span>

        {/* FAVORITE BUTTON */}

        <button
          onClick={handleFavorite}
          aria-label={
            isFavorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "38px",
            height: "38px",
            border: "none",
            borderRadius: "50%",
            background: "white",
            fontSize: "22px",
            cursor: "pointer",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {isFavorite
            ? "❤️"
            : "🤍"}
        </button>
      </div>

      <div className="food-card-content">

        <h3>{food.name}</h3>

        <p className="food-price">
          ₹
          {Number(
            food.price
          ).toFixed(2)}
        </p>

        <button
          className="add-cart-button"
          onClick={
            handleAddToCart
          }
        >
          🛒 Add to Cart
        </button>

      </div>
    </div>
  );
}

export default FoodCard;