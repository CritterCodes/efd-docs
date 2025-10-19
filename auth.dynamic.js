// Dynamic auth configuration that switches based on feature flag
import { NextAuthConfig } from 'next-auth';

// Import both auth configurations
const useCentralizedAuth = process.env.USE_CENTRALIZED_AUTH === 'true';

let authConfig;

if (useCentralizedAuth) {
    // Use centralized auth (redirect to admin)
    const { auth, handlers, signIn, signOut } = await import('./auth.centralized.js');
    authConfig = { auth, handlers, signIn, signOut };
} else {
    // Use current local auth
    const { auth, handlers, signIn, signOut } = await import('./auth.backup.js');
    authConfig = { auth, handlers, signIn, signOut };
}

export const { auth, handlers, signIn, signOut } = authConfig;