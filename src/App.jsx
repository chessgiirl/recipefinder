import { useState, useRef } from "react";

function App() {
  // States
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [error, setError] = useState("");

  // Ref for auto-scroll
  const detailsRef = useRef(null);

  // Search function
  const searchRecipes = async () => {
    if (!query.trim()) return;

    try {
      setError("");
      setSelectedRecipe(null);

      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      const data = await response.json();

      if (data.meals) {
        setRecipes(data.meals);
      } else {
        setRecipes([]);
        setError("No recipes found.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-green-600 text-white py-6 shadow">
        <h1 className="text-3xl font-bold text-center">🍲 Recipe Finder</h1>
        <p className="text-center text-green-100 mt-2">
          Search meals using TheMealDB API
        </p>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto mt-10 px-4">
        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search for recipes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={searchRecipes}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Search
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-center text-red-500 mt-6">{error}</p>}

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
          {recipes.map((recipe) => (
            <div
              key={recipe.idMeal}
              onClick={() => {
                setSelectedRecipe(recipe);
                setTimeout(() => {
                  detailsRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{recipe.strMeal}</h3>
                <p className="text-sm text-gray-500">
                  {recipe.strCategory} • {recipe.strArea}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Recipe Details */}
        {selectedRecipe && (
          <div
            ref={detailsRef}
            className="bg-white p-6 rounded-lg shadow mt-10"
          >
            <h2 className="text-2xl font-bold mb-4">{selectedRecipe.strMeal}</h2>

            <img
              src={selectedRecipe.strMealThumb}
              alt={selectedRecipe.strMeal}
              className="w-full max-w-md mb-4 rounded"
            />

            <h3 className="font-semibold text-lg mb-2">Instructions</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {selectedRecipe.strInstructions}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 mt-16 pb-6">
        ALX Frontend Capstone Project
      </footer>
    </div>
  );
}

export default App;
