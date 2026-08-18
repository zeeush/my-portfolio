const fs = require('fs');

if (fs.existsSync('src/app/globals.css')) {
  let css = fs.readFileSync('src/app/globals.css', 'utf8');
  css = css.replace(/url\(\s*['"]?assets\//gi, "url('/assets/");
  fs.writeFileSync('src/app/globals.css', css);
  console.log('Fixed globals.css');
}

if (fs.existsSync('src/app/page.tsx')) {
  let page = fs.readFileSync('src/app/page.tsx', 'utf8');
  page = page.replace(/src=["']assets\//gi, 'src="/assets/');
  fs.writeFileSync('src/app/page.tsx', page);
  console.log('Fixed page.tsx');
}
