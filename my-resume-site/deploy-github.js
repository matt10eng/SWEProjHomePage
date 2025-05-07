const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, 'package.json');
const pkg = require(packagePath);

// Save the current homepage
const currentHomepage = pkg.homepage;

// Set the homepage for GitHub Pages deployment
pkg.homepage = "https://matt10eng.github.io/SWEProjHomePage";

// Write the updated package.json
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));

console.log(`Set homepage to ${pkg.homepage} for GitHub Pages deployment`);

// Run the actual build and deploy commands
require('child_process').execSync('npm run build && gh-pages -d build', { stdio: 'inherit' });

// Restore the original homepage
pkg.homepage = currentHomepage;
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));

console.log(`Restored homepage to ${currentHomepage}`); 