const express = require("express");
const Recipe = require("../models/Recipe");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Konfigurasi penyimpanan gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Tambah Resep
router.post("/", authenticate, upload.single("image"), async (req, res) => {
  try {
    // return res.json(req.body);
    const recipe = new Recipe({
      title: req.body.title,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      image: req.file.path,
    });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ambil Semua Resep
router.get("/", async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

// Edit Resep
router.put("/:id", authenticate, upload.single("image"), async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    recipe.title = req.body.title;
    recipe.ingredients = req.body.ingredients;
    recipe.instructions = req.body.instructions;

    if (req.file) {
      if (recipe.image) {
        const filePath = path.join(__dirname, "../", recipe.image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      recipe.image = req.file.path;
    }

    await recipe.save();
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Hapus Resep
router.delete("/:id", async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (recipe.image) {
    const filePath = path.join(__dirname, "../", recipe.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  await Recipe.findByIdAndDelete(req.params.id);
  res.json({ message: "Resep dihapus" });
});

module.exports = router;
