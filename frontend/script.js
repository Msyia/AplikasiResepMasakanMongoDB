document.addEventListener("DOMContentLoaded", async function () {
  const recipesContainer = document.getElementById("recipes");

  // Tampilkan loading sebelum data muncul
  recipesContainer.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch("http://localhost:5000/recipes");
    const recipes = await response.json();

    recipesContainer.innerHTML = ""; // Kosongkan kontainer setelah data diambil

    recipes.forEach((recipe) => {
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("recipe-card");
      recipeCard.innerHTML = `
                <img src="http://localhost:5000/${recipe.image}" alt="${
        recipe.title
      }">
                <h2>${recipe.title}</h2>
                <p><strong>Bahan:</strong> ${recipe.ingredients.join(", ")}</p>
                <p><strong>Instruksi:</strong> ${recipe.instructions}</p>
                <button class="edit-btn" onclick="editRecipe('${
                  recipe._id
                }', '${recipe.title}', '${recipe.ingredients.join(",")}', '${
        recipe.instructions
      }')">✏️ Edit</button>
                <button class="delete-btn" onclick="deleteRecipe('${
                  recipe._id
                }')">🗑️ Hapus</button>
            `;
      if (localStorage.getItem("token")) {
        recipeCard.querySelector(".edit-btn").style.display = "inline-block";
        recipeCard.querySelector(".delete-btn").style.display = "inline-block";
      } else {
        recipeCard.querySelector(".edit-btn").style.display = "none";
        recipeCard.querySelector(".delete-btn").style.display = "none";
      }
      recipesContainer.appendChild(recipeCard);
    });
  } catch (error) {
    recipesContainer.innerHTML = "<p>Gagal memuat data. Coba lagi nanti.</p>";
  }
});

// Fungsi untuk menghapus resep
async function deleteRecipe(id) {
  if (confirm("Apakah Anda yakin ingin menghapus resep ini?")) {
    const response = await fetch(`http://localhost:5000/recipes/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Resep berhasil dihapus!");
      location.reload();
    } else {
      alert("Gagal menghapus resep.");
    }
  }
}

// Fungsi untuk mengedit resep (redirect ke halaman edit)
function editRecipe(id, title, ingredients, instructions) {
  localStorage.setItem("editRecipeId", id);
  localStorage.setItem("editRecipeTitle", title);
  localStorage.setItem("editRecipeIngredients", ingredients);
  localStorage.setItem("editRecipeInstructions", instructions);
  window.location.href = "edit-recipe.html";
}
