const fs = require('fs');

const CLIENT_ID = 'LuZWYV19LBzRr107EGKRF1zB_LU95jP_yfzWj8Eun6U';
const terms = [
  "uv printing",
  "acrylic sign",
  "banner stand",
  "led sign",
  "neon sign",
  "flex banner",
  "storefront sign",
  "3d letters sign",
  "logo design",
  "business card design",
  "brochure design",
  "restaurant menu design",
  "3d logo",
  "banner design"
];

async function run() {
  const results = {};
  for (const term of terms) {
    try {
      const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}&client_id=${CLIENT_ID}&per_page=1`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        results[term] = data.results[0].urls.regular;
      } else {
        results[term] = "No result";
      }
    } catch (err) {
      results[term] = "Error: " + err.message;
    }
  }
  console.log(JSON.stringify(results, null, 2));
}

run();
