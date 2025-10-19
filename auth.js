import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Feature flag for centralized auth
const USE_CENTRALIZED_AUTH = process.env.USE_CENTRALIZED_AUTH === 'true';

if (USE_CENTRALIZED_AUTH) {
    console.log('🔄 EFD Docs: Using CENTRALIZED auth (redirect to admin)');
} else {
    console.log('🔒 EFD Docs: Using LOCAL auth (current system)');
}

// Use internal URL for server-side calls, external for client-side
const getApiUrl = () => {
    // In server-side context, use internal localhost
    if (typeof window === 'undefined') {
        return process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_URL || 'http://localhost:3002';
    }
    // In client-side context, use the external URL
    return process.env.NEXT_PUBLIC_URL || window.location.origin;
};

const providers = USE_CENTRALIZED_AUTH ? [] : [
    CredentialsProvider({
        credentials: {
            email: { label: 'Email Address', type: 'email' },
            password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials) {
            try {
                const apiUrl = getApiUrl();
                console.log('Auth calling API at:', apiUrl);
                
                const response = await fetch(`${apiUrl}/api/auth/signin`, {
                    method: "POST",
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                });

                if (response.status === 403) {
                    // Client user trying to access docs panel - don't throw, just return null
                    console.error("Client access denied");
                    return null;
                }

                if (!response.ok) {
                    console.error("Login failed. Invalid credentials.");
                    return null;
                }

                let user;
                try {
                    user = await response.json();
                } catch (parseError) {
                    console.error('Error parsing login response:', parseError);
                    return null;
                }
                
                if (user) {
                    return {
                        userID: user.userID,
                        name: `${user.firstName} ${user.lastName}`,
                        email: user.email,
                        role: user.role,
                        token: user.token,
                        image: user.image
                    };
                }
            } catch (error) {
                console.error("Login error:", error);
                return null;
            }
        }
    })
];

export const providerMap = providers.map((provider) => {
    if (typeof provider === 'function') {
        const providerData = provider();
        return { id: providerData.id, name: providerData.name };
    }
    return { id: provider.id, name: provider.name };
});

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers,
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth/signin',
    },
    cookies: USE_CENTRALIZED_AUTH ? {
        // For centralized auth, use shared cookie domain
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                // Only set domain if explicitly provided and valid
                ...(process.env.NEXTAUTH_COOKIE_DOMAIN && process.env.NEXTAUTH_COOKIE_DOMAIN !== 'localhost' ? 
                    { domain: process.env.NEXTAUTH_COOKIE_DOMAIN } : {}),
                secure: process.env.NODE_ENV === 'production'
            }
        }
    } : {
        // Local auth cookies (current system) - no custom domain needed
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production'
            }
        },
        callbackUrl: {
            name: `next-auth.callback-url`,
            options: {
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production'
            }
        },
        csrfToken: {
            name: `next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production'
            }
        }
    },
    callbacks: USE_CENTRALIZED_AUTH ? {
        // Centralized auth callbacks - handle redirects to/from admin
        async redirect({ url, baseUrl }) {
            // Allow redirects to admin app
            if (url.startsWith(process.env.NEXT_PUBLIC_ADMIN_URL)) {
                return url;
            }
            if (url.startsWith("/")) {
                return `${baseUrl}${url}`;
            }
            return baseUrl;
        },
        async jwt({ token }) {
            // For centralized auth, token management is handled by admin app
            return token;
        },
        async session({ session }) {
            // Pass through session from admin app
            return session;
        }
    } : {
        // Local auth callbacks (current system)
        async jwt({ token, account, user }) {
            // When the user signs in
            if (account) {
                // For credentials auth, we don't need OAuth tokens
                if (account.provider === 'credentials') {
                    token.userID = user.userID;
                    token.name = user.name;
                    token.role = user.role;
                    token.image = user.image;
                    console.log("JWT callback - Credentials token created");
                    return token;
                } else {
                    // For OAuth providers (Google, etc.)
                    token.accessToken = account.access_token;
                    token.refreshToken = account.refresh_token;
                    token.accessTokenExpires = Date.now() + (account.expires_in || 3600) * 1000;
                    token.userID = user.userID;
                    token.name = user.name;
                    token.role = user.role;
                    token.image = user.image;
                    console.log("JWT callback - OAuth token created");
                    return token;
                }
            }

            // For credentials auth, no refresh needed - just return the token
            if (!token.refreshToken) {
                console.log("JWT callback - Credentials auth, no refresh needed");
                return token;
            }
    
            // If there's an error from a previous refresh attempt, just return the token
            if (token.error === "RefreshAccessTokenError") {
                console.log("JWT callback - Previous refresh error, returning token as-is");
                return token;
            }

            // Return the token if the access token is still valid
            if (Date.now() < token.accessTokenExpires - 300000) { // 5 minutes buffer
                console.log("JWT callback - Token still valid, returning as-is");
                return token;
            }

            // Token is expired, refresh it (only for OAuth providers)
            console.log("JWT callback - Token expired, refreshing...");
            return refreshAccessToken(token);
        },
        async session({ token, session }) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken;
            session.user.userID = token.userID;
            session.user.role = token.role;
            session.user.image = token.image;
            session.user.name = token.name;
            session.error = token.error;
            return session;
        }
    }
});

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 * Only used in local auth mode
 */
async function refreshAccessToken(token) {
    // Skip refresh in centralized auth mode
    if (USE_CENTRALIZED_AUTH) {
        return token;
    }
    
    try {
        if (!token.refreshToken) {
            console.log("No refresh token available");
            return {
                ...token,
                error: "RefreshAccessTokenError",
            };
        }

        const url = "https://oauth2.googleapis.com/token";
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
            }),
        });

        let refreshedTokens;
        try {
            refreshedTokens = await response.json();
        } catch (parseError) {
            console.error('Error parsing refresh token response:', parseError);
            throw new Error('Failed to parse refresh token response');
        }

        if (!response.ok) {
            console.error("Error refreshing access token - Response not ok:", refreshedTokens);
            throw refreshedTokens;
        }

        console.log("Access token refreshed successfully");
        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token || token.refreshToken,
        };
    } catch (error) {
        console.error("Error refreshing access token:", error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}