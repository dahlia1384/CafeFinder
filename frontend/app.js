const resultsGrid = document.querySelector("#results-grid");
const resultsCount = document.querySelector("#results-count");
const filtersLabel = document.querySelector("#active-filters");
const searchForm = document.querySelector("#search-form");
const resetButton = document.querySelector("#reset-search");
const topPicksButton = document.querySelector("#top-picks");
const howItWorksButton = document.querySelector("#how-it-works");
const newsletterForm = document.querySelector("#newsletter-form");
const newsletterMessage = document.querySelector("#newsletter-message");

let cafes = [];

const renderResults = (list, filtersText) => {
  resultsGrid.innerHTML = "";
  resultsCount.textContent = list.length.toString();
  filtersLabel.textContent = filtersText;

  if (list.length === 0) {
    resultsGrid.innerHTML =
      "<p class=\"results-empty\">No cafes match that vibe yet.</p>";
    return;
  }

  list.forEach((cafe) => {
    const card = document.createElement("article");
    card.className = "result-card";
    card.innerHTML = `
      <div>
        <h3>${cafe.name}</h3>
        <p>${cafe.neighborhood} · ${cafe.rating.toFixed(1)} ★</p>
      </div>
      <div class="result-tags">
        ${cafe.vibes.map((vibe) => `<span>${vibe}</span>`).join("")}
      </div>
      <ul>
        ${cafe.features.map((feature) => `<li>${feature}</li>`).join("")}
      </ul>
      <button class="button ghost" type="button">Save spot</button>
    `;
    resultsGrid.appendChild(card);
  });
};

const filterCafes = (cityValue, vibeValue) => {
  const normalizedVibe = vibeValue.trim().toLowerCase();
  const matches = cafes.filter((cafe) => {
    if (!normalizedVibe) {
      return true;
    }
    return cafe.vibes.some((vibe) => vibe.includes(normalizedVibe));
  });

  const filtersText = normalizedVibe
    ? `${cityValue} · ${normalizedVibe}`
    : "All vibes";

  renderResults(matches, filtersText);

  resultsGrid.scrollIntoView({ behavior: "smooth" });
};

const loadCafes = async () => {
  try {
    const response = await fetch("/api/cafes");
    if (!response.ok) {
      throw new Error("Request failed");
    }
    const data = await response.json();
    cafes = data.cafes || [];
    const cityValue = searchForm.elements.city.value;
    const vibeValue = searchForm.elements.vibe.value;
    filterCafes(cityValue, vibeValue);
  } catch (error) {
    resultsGrid.innerHTML =
      "<p class=\"results-empty\">Unable to load cafes. Start the backend server.</p>";
  }
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cityValue = searchForm.elements.city.value;
  const vibeValue = searchForm.elements.vibe.value;
  filterCafes(cityValue, vibeValue);
});

resetButton.addEventListener("click", () => {
  searchForm.reset();
  searchForm.elements.city.value = "Vancouver, BC";
  renderResults(cafes, "All vibes");
});

topPicksButton.addEventListener("click", () => {
  renderResults(cafes.slice(0, 3), "Top picks");
  resultsGrid.scrollIntoView({ behavior: "smooth" });
});

howItWorksButton.addEventListener("click", () => {
  document.querySelector("#insights").scrollIntoView({ behavior: "smooth" });
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const emailValue = newsletterForm.elements.email.value.trim();
  if (!emailValue) {
    newsletterMessage.textContent = "Please enter a valid email.";
    return;
  }
  newsletterMessage.textContent = `Thanks! We'll send updates to ${emailValue}.`;
  newsletterForm.reset();
});

loadCafes();
