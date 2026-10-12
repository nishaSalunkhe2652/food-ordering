
import { useEffect, useState } from "react";
import FoodCard from "../components/FoodCard";

function Menu({ addToCart }) {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch foods from backend API
  useEffect(() => {
    fetch("http://https://food-ordering-5v9t.onrender.com/api/foods")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch food items");
        }

        return response.json();
      })
      .then((data) => {
        setFoods(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching foods:", error);
        setError("Unable to load food items. Please try again.");
        setLoading(false);
      });
  }, []);

  const categories = [
    "All",
    "Veg Starters",
    "Non-Veg Starters",
    "Veg Main Course",
    "Non-Veg Main Course",
    "Rice & Biryani",
    "Roti Naan Chapati",
    "Snacks",
    "Pizza & Pasta",
    "Cold Drinks",
  ];

  const sectionIcons = {
    "Veg Starters": "🥗",
    "Non-Veg Starters": "🍗",
    "Veg Main Course": "🍛",
    "Non-Veg Main Course": "🍖",
    "Rice & Biryani": "🍚",
    "Roti Naan Chapati": "🫓",
    Snacks: "🍟",
    "Pizza & Pasta": "🍕",
    "Cold Drinks": "🥤",
  };

  const sections = [
    "Veg Starters",
    "Non-Veg Starters",
    "Veg Main Course",
    "Non-Veg Main Course",
    "Rice & Biryani",
    "Roti Naan Chapati",
    "Snacks",
    "Pizza & Pasta",
    "Cold Drinks",
  ];

  // Search matching foods
  const searchResults = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="menu">
      {/* MENU HEADER */}
      <div className="menu-header">
        <h1>OUR MENU 🍴</h1>

        <p>Find Your Favorite Food</p>

        <p>Fresh, tasty and delicious food for everyone.</p>
      </div>

      {/* LOADING MESSAGE */}
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            fontSize: "18px",
          }}
        >
          Loading food items... 🍴
        </div>
      )}

      {/* ERROR MESSAGE */}
      {!loading && error && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "red",
            fontSize: "18px",
          }}
        >
          {error}
        </div>
      )}

      {/* MENU CONTENT */}
      {!loading && !error && (
        <>
          {/* LARGE SEARCH BAR */}
          <div
            style={{
              width: "100%",
              maxWidth: "850px",
              margin: "0 auto 35px",
            }}
          >
            <input
              type="text"
              placeholder="🔍  Search your favorite food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                height: "60px",
                padding: "0 25px",
                fontSize: "18px",
                border: "2px solid #ddd",
                borderRadius: "30px",
                background: "#ffffff",
                color: "#222",
                outline: "none",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
              }}
            />
          </div>

          {/* CATEGORY BUTTONS */}
          <div
            style={{
              width: "100%",
              maxWidth: "1250px",
              margin: "0 auto 40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  background:
                    selectedCategory === category ? "#ff5722" : "#ffffff",
                  color:
                    selectedCategory === category ? "#ffffff" : "#333",
                  border: "1px solid #ddd",
                  borderRadius: "25px",
                  padding: "10px 18px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* NO FOOD FOUND */}
          {search.trim() !== "" && searchResults.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#ffffff",
                borderRadius: "12px",
                maxWidth: "700px",
                margin: "0 auto",
                boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: "55px",
                  marginBottom: "15px",
                }}
              >
                🔍
              </div>

              <h2
                style={{
                  color: "#222",
                  marginBottom: "10px",
                }}
              >
                No food items found
              </h2>

              <p
                style={{
                  color: "#777",
                  fontSize: "16px",
                }}
              >
                Try searching for another food item.
              </p>
            </div>
          )}

          {/* FOOD SECTIONS */}
          {searchResults.length > 0 &&
            sections.map((section) => {
              if (
                selectedCategory !== "All" &&
                selectedCategory !== section
              ) {
                return null;
              }

              const sectionFoods = searchResults.filter(
                (food) => food.category === section
              );

              if (sectionFoods.length === 0) {
                return null;
              }

              return (
                <div className="food-section" key={section}>
                  <h2 className="section-heading">
                    {sectionIcons[section]} {section}
                    <span>({sectionFoods.length} items)</span>
                  </h2>

                  <div className="food-container">
                    {sectionFoods.map((food) => (
                      <FoodCard
                        key={food.id}
                        food={food}
                        addToCart={addToCart}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
        </>
      )}
    </section>
  );
}

export default Menu;
