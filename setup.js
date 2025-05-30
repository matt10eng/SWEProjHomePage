//
Setup
script
placeholder

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}=====================================${colors.reset}`);
console.log(`${colors.cyan}    E-commerce Project Setup Tool    ${colors.reset}`);
console.log(`${colors.cyan}=====================================${colors.reset}\n`);

// Create .env files if they don't exist
function setupEnvFiles() {
  console.log(`${colors.blue}Setting up environment files...${colors.reset}`);
  
  // Backend .env
  if (!fs.existsSync(path.join(__dirname, 'backend', '.env'))) {
    try {
      fs.copyFileSync(
        path.join(__dirname, 'backend', '.env.template'),
        path.join(__dirname, 'backend', '.env')
      );
      console.log(`${colors.green}✓ Created backend/.env from template${colors.reset}`);
    } catch (err) {
      console.error(`${colors.red}✗ Failed to create backend/.env: ${err.message}${colors.reset}`);
    }
  } else {
    console.log(`${colors.yellow}⚠ backend/.env already exists, skipping${colors.reset}`);
  }
  
  // Frontend .env
  if (!fs.existsSync(path.join(__dirname, 'my-resume-site', '.env'))) {
    try {
      fs.copyFileSync(
        path.join(__dirname, 'my-resume-site', '.env.template'),
        path.join(__dirname, 'my-resume-site', '.env')
      );
      console.log(`${colors.green}✓ Created my-resume-site/.env from template${colors.reset}`);
    } catch (err) {
      console.error(`${colors.red}✗ Failed to create my-resume-site/.env: ${err.message}${colors.reset}`);
    }
  } else {
    console.log(`${colors.yellow}⚠ my-resume-site/.env already exists, skipping${colors.reset}`);
  }
  
  console.log('');
}

// Install dependencies for backend and frontend
function installDependencies() {
  console.log(`${colors.blue}Installing dependencies... (this may take a few minutes)${colors.reset}`);
  
  // Install backend dependencies
  console.log(`${colors.yellow}Installing backend dependencies...${colors.reset}`);
  exec('cd backend && npm install', (error, stdout, stderr) => {
    if (error) {
      console.error(`${colors.red}✗ Error installing backend dependencies: ${error.message}${colors.reset}`);
      return;
    }
    
    if (stderr) {
      console.error(`${colors.yellow}⚠ Warnings during backend install: ${stderr}${colors.reset}`);
    }
    
    console.log(`${colors.green}✓ Backend dependencies installed successfully${colors.reset}`);
    
    // Install frontend dependencies after backend is done
    console.log(`${colors.yellow}Installing frontend dependencies...${colors.reset}`);
    exec('cd my-resume-site && npm install', (error, stdout, stderr) => {
      if (error) {
        console.error(`${colors.red}✗ Error installing frontend dependencies: ${error.message}${colors.reset}`);
        return;
      }
      
      if (stderr) {
        console.error(`${colors.yellow}⚠ Warnings during frontend install: ${stderr}${colors.reset}`);
      }
      
      console.log(`${colors.green}✓ Frontend dependencies installed successfully${colors.reset}\n`);
      
      // Show next steps
      showNextSteps();
    });
  });
}

// Show next steps after installation
function showNextSteps() {
  console.log(`${colors.cyan}=====================================${colors.reset}`);
  console.log(`${colors.cyan}           Setup Complete!           ${colors.reset}`);
  console.log(`${colors.cyan}=====================================${colors.reset}\n`);
  
  console.log(`${colors.blue}Next steps:${colors.reset}`);
  console.log(`${colors.yellow}1. Edit environment variables:${colors.reset}`);
  console.log(`   - Open ${colors.cyan}backend/.env${colors.reset} and fill in your MongoDB, Mailgun, and JWT details`);
  console.log(`   - Open ${colors.cyan}my-resume-site/.env${colors.reset} and set the API URL if needed\n`);
  
  console.log(`${colors.yellow}2. Start the backend server:${colors.reset}`);
  console.log(`   cd backend`);
  console.log(`   npm start\n`);
  
  console.log(`${colors.yellow}3. Start the frontend server:${colors.reset}`);
  console.log(`   cd my-resume-site`);
  console.log(`   npm start\n`);
  
  console.log(`${colors.green}Thank you for using our E-commerce Project!${colors.reset}`);
}

// Run setup
setupEnvFiles();
installDependencies();
