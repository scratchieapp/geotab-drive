#!/usr/bin/env node
// scripts/test-geotab-api.js
// Simple command-line script to test Geotab API authentication and data retrieval

const { authenticateGeotab, getDriverData } = require('../lib/geotab');
const dotenv = require('dotenv');

// Load environment variables from .env file if available
dotenv.config();

async function testGeotabConnection() {
  // Get credentials from env vars or command line args
  const username = process.env.GEOTAB_USERNAME || process.argv[2];
  const password = process.env.GEOTAB_PASSWORD || process.argv[3];
  const database = process.env.GEOTAB_DATABASE || process.argv[4];

  if (!username || !password || !database) {
    console.error('\x1b[31mMissing credentials!\x1b[0m');
    console.log('\nUsage:');
    console.log('  Option 1: Set environment variables GEOTAB_USERNAME, GEOTAB_PASSWORD, GEOTAB_DATABASE');
    console.log('  Option 2: node scripts/test-geotab-api.js <username> <password> <database>');
    process.exit(1);
  }

  console.log('\x1b[36m=== Geotab API Connection Test ===\x1b[0m');
  console.log(`Database: ${database}`);
  console.log(`Username: ${username}`);
  console.log('Password: *****');
  
  try {
    console.log('\n\x1b[33m1. Authenticating with Geotab...\x1b[0m');
    const { server, credentials } = await authenticateGeotab(username, password, database);
    
    console.log('\x1b[32m✓ Authentication successful!\x1b[0m');
    console.log(`Server: ${server}`);
    console.log(`Session ID: ${credentials.sessionId.substring(0, 10)}...`);
    
    console.log('\n\x1b[33m2. Fetching driver data...\x1b[0m');
    const drivers = await getDriverData(credentials, server);
    
    console.log(`\x1b[32m✓ Successfully retrieved ${drivers.length} drivers\x1b[0m`);
    
    // Display the first 5 drivers
    if (drivers.length > 0) {
      console.log('\nSample drivers:');
      drivers.slice(0, 5).forEach((driver, index) => {
        console.log(`${index + 1}. ${driver.name} (${driver.id.substring(0, 8)}...)`);
      });
    }
    
    console.log('\n\x1b[32m=== Test completed successfully! ===\x1b[0m');
    return { success: true };
  } catch (error) {
    console.error('\x1b[31m✗ Error:\x1b[0m', error.message);
    console.error('\nStack trace:', error.stack);
    return { success: false, error: error.message };
  }
}

// Run the test if executed directly (not imported)
if (require.main === module) {
  testGeotabConnection()
    .then(result => {
      if (!result.success) {
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Unhandled error:', err);
      process.exit(1);
    });
}

module.exports = testGeotabConnection; 