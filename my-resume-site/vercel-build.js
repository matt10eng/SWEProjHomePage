// Script to prepare package.json for Vercel build
const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, 'package.json');
const pkg = require(packagePath);

// Set the homepage for Vercel deployment
pkg.homepage = "/";

// Write the updated package.json
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));

console.log(`Set homepage to ${pkg.homepage} for Vercel deployment`);

// No need to execute anything else - Vercel will handle the build 