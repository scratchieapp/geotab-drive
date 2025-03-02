#!/usr/bin/env node
// scripts/deploy/setup-env.js
// Helper script to generate environment variables for Vercel deployment

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define the environment variables we need
const requiredEnvVars = [
  {
    name: 'GEOTAB_SERVER',
    description: 'Geotab API server (default: my.geotab.com)',
    default: 'my.geotab.com'
  },
  {
    name: 'GEOTAB_USERNAME',
    description: 'Geotab username (email)',
    default: ''
  },
  {
    name: 'GEOTAB_PASSWORD',
    description: 'Geotab password',
    default: '',
    sensitive: true
  },
  {
    name: 'GEOTAB_DATABASE',
    description: 'Geotab database name',
    default: ''
  }
];

// Store the collected values
const envValues = {};

// Function to prompt for each environment variable
function promptForEnvVars(index = 0) {
  if (index >= requiredEnvVars.length) {
    generateFiles();
    return;
  }

  const envVar = requiredEnvVars[index];
  const defaultText = envVar.default ? ` (default: ${envVar.default})` : '';
  const question = `${envVar.name}${defaultText}: `;

  rl.question(question, (answer) => {
    // Use default if answer is empty and default exists
    const value = answer.trim() || envVar.default;
    
    if (value) {
      envValues[envVar.name] = value;
      promptForEnvVars(index + 1);
    } else {
      console.log(`\x1b[33mWarning: No value provided for ${envVar.name}. This may cause issues.\x1b[0m`);
      promptForEnvVars(index + 1);
    }
  });
}

// Function to generate the .env file and Vercel config
function generateFiles() {
  // Generate .env file
  const envContent = Object.entries(envValues)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  fs.writeFileSync(path.join(process.cwd(), '.env'), envContent);
  console.log('\x1b[32m✓ Created .env file\x1b[0m');

  // Generate Vercel CLI command for setting environment variables
  const vercelEnvCommands = Object.entries(envValues)
    .map(([key, value]) => `vercel env add ${key}`)
    .join('\n');

  fs.writeFileSync(
    path.join(process.cwd(), 'scripts/deploy/set-vercel-env.sh'),
    `#!/bin/bash\n# Run these commands to set up Vercel environment variables\n\n${vercelEnvCommands}\n`
  );
  fs.chmodSync(path.join(process.cwd(), 'scripts/deploy/set-vercel-env.sh'), '755');
  console.log('\x1b[32m✓ Created Vercel environment setup script\x1b[0m');

  // Instructions
  console.log('\n\x1b[36mNext steps:\x1b[0m');
  console.log('1. Your .env file has been created for local development');
  console.log('2. For Vercel deployment, you can either:');
  console.log('   - Run the generated script: ./scripts/deploy/set-vercel-env.sh');
  console.log('   - Or manually add the environment variables in the Vercel dashboard');

  rl.close();
}

// Start the process
console.log('\x1b[36m=== Geotab Drive Scratchie Environment Setup ===\x1b[0m');
console.log('This script will help you set up the necessary environment variables');
console.log('for both local development and Vercel deployment.\n');

promptForEnvVars(); 