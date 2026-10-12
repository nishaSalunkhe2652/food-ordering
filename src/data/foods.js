const foods = [
  // VEG STARTERS
  { id: 1, name: "Paneer Tikka", price: 220, emoji: "🧀", category: "Veg Starters" },
  { id: 2, name: "Veg Manchurian", price: 180, emoji: "🥦", category: "Veg Starters" },
  { id: 3, name: "Paneer Chilli", price: 210, emoji: "🌶️", category: "Veg Starters" },
  { id: 4, name: "Veg Spring Roll", price: 160, emoji: "🥢", category: "Veg Starters" },
  { id: 5, name: "Hara Bhara Kebab", price: 190, emoji: "🥬", category: "Veg Starters" },

  // NON VEG STARTERS
  { id: 6, name: "Chicken Tikka", price: 280, emoji: "🍗", category: "Non-Veg Starters" },
  { id: 7, name: "Chicken 65", price: 260, emoji: "🍗", category: "Non-Veg Starters" },
  { id: 8, name: "Chicken Lollipop", price: 290, emoji: "🍗", category: "Non-Veg Starters" },
  { id: 9, name: "Chicken Chilli", price: 270, emoji: "🌶️", category: "Non-Veg Starters" },
  { id: 10, name: "Fish Fry", price: 300, emoji: "🐟", category: "Non-Veg Starters" },

  // VEG MAIN COURSE
  { id: 11, name: "Paneer Butter Masala", price: 240, emoji: "🍛", category: "Veg Main Course" },
  { id: 12, name: "Kaju Masala", price: 250, emoji: "🥘", category: "Veg Main Course" },
  { id: 13, name: "Veg Kolhapuri", price: 210, emoji: "🍲", category: "Veg Main Course" },
  { id: 14, name: "Dal Tadka", price: 160, emoji: "🥣", category: "Veg Main Course" },
  { id: 15, name: "Mix Veg", price: 190, emoji: "🥗", category: "Veg Main Course" },
  { id: 16, name: "Palak Paneer", price: 220, emoji: "🥬", category: "Veg Main Course" },

  // NON VEG MAIN COURSE
  { id: 17, name: "Chicken Masala", price: 280, emoji: "🍗", category: "Non-Veg Main Course" },
  { id: 18, name: "Chicken Handi", price: 320, emoji: "🍲", category: "Non-Veg Main Course" },
  { id: 19, name: "Chicken Kolhapuri", price: 300, emoji: "🌶️", category: "Non-Veg Main Course" },
  { id: 20, name: "Butter Chicken", price: 330, emoji: "🍗", category: "Non-Veg Main Course" },
  { id: 21, name: "Mutton Masala", price: 380, emoji: "🍖", category: "Non-Veg Main Course" },
  { id: 22, name: "Mutton Handi", price: 420, emoji: "🍲", category: "Non-Veg Main Course" },

  // RICE & BIRYANI
  { id: 23, name: "Veg Biryani", price: 200, emoji: "🍚", category: "Rice & Biryani" },
  { id: 24, name: "Chicken Biryani", price: 280, emoji: "🍗", category: "Rice & Biryani" },
  { id: 25, name: "Mutton Biryani", price: 350, emoji: "🍖", category: "Rice & Biryani" },
  { id: 26, name: "Jeera Rice", price: 150, emoji: "🍚", category: "Rice & Biryani" },
  { id: 27, name: "Veg Fried Rice", price: 180, emoji: "🍚", category: "Rice & Biryani" },
  { id: 28, name: "Chicken Fried Rice", price: 230, emoji: "🍗", category: "Rice & Biryani" },

  // ROTI NAAN CHAPATI
  { id: 29, name: "Plain Roti", price: 25, emoji: "🫓", category: "Roti Naan Chapati" },
  { id: 30, name: "Butter Roti", price: 35, emoji: "🫓", category: "Roti Naan Chapati" },
  { id: 31, name: "Butter Naan", price: 60, emoji: "🫓", category: "Roti Naan Chapati" },
  { id: 32, name: "Garlic Naan", price: 80, emoji: "🫓", category: "Roti Naan Chapati" },
  { id: 33, name: "Cheese Naan", price: 110, emoji: "🧀", category: "Roti Naan Chapati" },
  { id: 34, name: "Chapati", price: 20, emoji: "🫓", category: "Roti Naan Chapati" },

  // SNACKS
  { id: 35, name: "French Fries", price: 120, emoji: "🍟", category: "Snacks" },
  { id: 36, name: "Cheese Fries", price: 160, emoji: "🍟", category: "Snacks" },
  { id: 37, name: "Veg Sandwich", price: 120, emoji: "🥪", category: "Snacks" },
  { id: 38, name: "Grilled Sandwich", price: 150, emoji: "🥪", category: "Snacks" },
  { id: 39, name: "Veg Burger", price: 130, emoji: "🍔", category: "Snacks" },
  { id: 40, name: "Chicken Burger", price: 180, emoji: "🍔", category: "Snacks" },

  // PIZZA & PASTA
  { id: 41, name: "Margherita Pizza", price: 220, emoji: "🍕", category: "Pizza & Pasta" },
  { id: 42, name: "Farmhouse Pizza", price: 280, emoji: "🍕", category: "Pizza & Pasta" },
  { id: 43, name: "Paneer Pizza", price: 300, emoji: "🍕", category: "Pizza & Pasta" },
  { id: 44, name: "White Sauce Pasta", price: 220, emoji: "🍝", category: "Pizza & Pasta" },
  { id: 45, name: "Red Sauce Pasta", price: 210, emoji: "🍝", category: "Pizza & Pasta" },

  // COLD DRINKS
  { id: 46, name: "Coca Cola", price: 60, emoji: "🥤", category: "Cold Drinks" },
  { id: 47, name: "Pepsi", price: 60, emoji: "🥤", category: "Cold Drinks" },
  { id: 48, name: "Sprite", price: 60, emoji: "🥤", category: "Cold Drinks" },
  { id: 49, name: "Fresh Lime Soda", price: 80, emoji: "🍋", category: "Cold Drinks" },
  { id: 50, name: "Cold Coffee", price: 120, emoji: "☕", category: "Cold Drinks" },
];

export default foods;