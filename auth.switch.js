// Auth configuration switcher
// This allows us to safely test centralized auth without breaking current functionality

const USE_CENTRALIZED_AUTH = process.env.USE_CENTRALIZED_AUTH === 'true';

// Import the appropriate auth configuration
if (USE_CENTRALIZED_AUTH) {
    console.log('🔄 Using CENTRALIZED auth (redirect to admin)');
    module.exports = require('./auth.centralized.js');
} else {
    console.log('🔒 Using LOCAL auth (current system)');
    module.exports = require('./auth.backup.js');
}