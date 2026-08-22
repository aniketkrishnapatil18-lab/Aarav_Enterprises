const fs = require('fs');

const file = 'src/pages/Home.jsx';
let content = fs.readFileSync(file, 'utf8');

// The objects look like:
// {
//   id: "sp-ru-1",
//   name: "Roll Up Standee",
//   slug: "roll-up-standee",
//   starting_price: 1999,
//   thumbnail_url: "https://images.unsplash.com/photo-1649277781605-f38d9ced2e17?..."
// }

content = content.replace(/{\s*id:\s*"[^"]+",\s*name:\s*"([^"]+)",\s*slug:\s*"[^"]+",\s*starting_price:\s*\d+,\s*thumbnail_url:\s*"([^"]+)"\s*}/g, (match, name, url) => {
  if (name.includes('Standee')) {
    return match.replace(url, '/images/standee.jpg');
  }
  if (name.includes('Banner')) {
    return match.replace(url, '/images/banner.jpg');
  }
  return match;
});

// There is also the shop by category section which has a different format (missing slug maybe?)
// {
//   id: "cat-3",
//   name: "Roll Up Standee",
//   thumbnail_url: "https://images.unsplash.com/photo-1649277781605-f38d9ced2e17?...",
//   starting_price: 1999,
// }
content = content.replace(/{\s*id:\s*"cat-\d+",\s*name:\s*"([^"]+)",\s*thumbnail_url:\s*"([^"]+)",\s*starting_price:\s*\d+,?\s*}/g, (match, name, url) => {
  if (name.includes('Standee')) {
    return match.replace(url, '/images/standee.jpg');
  }
  if (name.includes('Banner')) {
    return match.replace(url, '/images/banner.jpg');
  }
  return match;
});


fs.writeFileSync(file, content);
console.log('done replacing in Home.jsx');
