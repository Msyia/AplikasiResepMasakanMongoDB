const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  instructions: String,
  image: String, // Tambahkan kolom untuk menyimpan URL gambar
});

module.exports = mongoose.model("Recipe", recipeSchema);
