// lib/constants.js
const Constants = {
    // Core Collections
    USERS_COLLECTION: 'users',
    
    // Documentation Collections
    DOCS_COLLECTION: 'docs',
    GUIDES_COLLECTION: 'guides',
    RELEASES_COLLECTION: 'releases',
    
    // Default Projections
    DEFAULT_PROJECTION: {
        _id: 0,
    },
    PUBLIC_USER_PROJECTION: {
        password: 0,
        verificationToken: 0,
        resetToken: 0,
        _id: 0
    },
    
    // User Roles
    USER_ROLES: {
        ADMIN: 'admin',
        ARTISAN: 'artisan',
        WHOLESALER: 'wholesaler',
        CUSTOMER: 'customer'
    },
    
    // User Status
    USER_STATUS: {
        ACTIVE: 'active',
        UNVERIFIED: 'unverified',
        SUSPENDED: 'suspended'
    }
};

export default Constants;