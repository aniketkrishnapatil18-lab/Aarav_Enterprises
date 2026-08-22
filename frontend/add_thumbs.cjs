const fs = require('fs');

const file = 'src/pages/Home.jsx';
let content = fs.readFileSync(file, 'utf8');

const imgMap = {
  "Logo": "https://images.unsplash.com/photo-1561070791-2526d30994b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5Mjc0fDB8MXxzZWFyY2h8MXx8bG9nbyUyMGRlc2lnbnxlbnwwfHx8fDE3ODczODU1MDR8MA&ixlib=rb-4.1.0&q=80&w=400",
  "3D Logo": "https://images.unsplash.com/photo-1662070479020-73f77887c87c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5Mjc0fDB8MXxzZWFyY2h8MXx8M2QlMjBsb2dvfGVufDB8fHx8MTc4NzM4NTUwN3ww&ixlib=rb-4.1.0&q=80&w=400",
  "Card": "https://images.unsplash.com/photo-1623305465231-d884ce752d59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5Mjc0fDB8MXxzZWFyY2h8MXx8YnVzaW5lc3MlMjBjYXJkJTIwZGVzaWdufGVufDB8fHx8MTc4NzM4NTUwNXww&ixlib=rb-4.1.0&q=80&w=400",
  "Brochure": "https://images.unsplash.com/photo-1658863025658-4a259cc68fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5Mjc0fDB8MXxzZWFyY2h8MXx8YnJvY2h1cmUlMjBkZXNpZ258ZW58MHx8fHwxNzg3Mzg1NTA2fDA&ixlib=rb-4.1.0&q=80&w=400",
  "Menu": "https://images.unsplash.com/photo-1731412235213-678ada5cd36b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5Mjc0fDB8MXxzZWFyY2h8MXx8cmVzdGF1cmFudCUyMG1lbnUlMjBkZXNpZ258ZW58MHx8fHwxNzg3Mzg1NTA2fDA&ixlib=rb-4.1.0&q=80&w=400",
  "Banner": "https://images.unsplash.com/photo-1646310997921-9565eff3eac0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5Mjc0fDB8MXxzZWFyY2h8MXx8YmFubmVyJTIwZGVzaWdufGVufDB8fHx8MTc4NzM4NTUwN3ww&ixlib=rb-4.1.0&q=80&w=400",
  "UV": "https://images.unsplash.com/photo-1503694978374-8a2fa686963a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5Mjc0fDB8MXxzZWFyY2h8MXx8dXYlMjBwcmludGluZ3xlbnwwfHx8fDE3ODczODU1MDB8MA&ixlib=rb-4.1.0&q=80&w=400",
  "Acrylic": "https://images.unsplash.com/photo-1617710501559-858f449528e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5Mjc0fDB8MXxzZWFyY2h8MXx8YWNyeWxpYyUyMHNpZ258ZW58MHx8fHwxNzg3Mzg1NTAxfDA&ixlib=rb-4.1.0&q=80&w=400",
  "Standee": "https://images.unsplash.com/photo-1649277781605-f38d9ced2e17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5Mjc0fDB8MXxzZWFyY2h8MXx8YmFubmVyJTIwc3RhbmR8ZW58MHx8fHwxNzg3Mzg1NTAyfDA&ixlib=rb-4.1.0&q=80&w=400",
  "LED": "https://images.unsplash.com/photo-1496449903678-68ddcb189a24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5Mjc0fDB8MXxzZWFyY2h8MXx8bGVkJTIwc2lnbnxlbnwwfHx8fDE3ODczODU1MDJ8MA&ixlib=rb-4.1.0&q=80&w=400",
  "Glow": "https://images.unsplash.com/photo-1543332164-6e82f355badc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5Mjc0fDB8MXxzZWFyY2h8MXx8bmVvbiUyMHNpZ258ZW58MHx8fHwxNzg3Mzg1NTAzfDA&ixlib=rb-4.1.0&q=80&w=400",
  "Flex": "https://images.unsplash.com/photo-1646310997921-9565eff3eac0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5Mjc0fDB8MXxzZWFyY2h8MXx8YmFubmVyJTIwZGVzaWdufGVufDB8fHx8MTc4NzM4NTUwN3ww&ixlib=rb-4.1.0&q=80&w=400",
  "Default": "https://images.unsplash.com/photo-1544059799-1e84c415f2d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5Mjc0fDB8MXxzZWFyY2h8MXx8c3RvcmVmcm9udCUyMHNpZ258ZW58MHx8fHwxNzg3Mzg1NTAzfDA&ixlib=rb-4.1.0&q=80&w=400"
};

content = content.replace(/{\s*id:\s*"[^"]+",\s*name:\s*"([^"]+)",\s*slug:\s*"[^"]+",\s*starting_price:\s*\d+,?(?!\s*thumbnail_url)\s*}/g, (match, name) => {
  let url = imgMap["Default"];
  for (const key in imgMap) {
    if (name.includes(key)) {
      url = imgMap[key];
      break;
    }
  }
  // The match won't have thumbnail_url, so we just inject it before the last brace
  return match.replace(/\s*}$/, `,\n        thumbnail_url: "${url}",\n      }`);
});

fs.writeFileSync(file, content);
console.log('done');
