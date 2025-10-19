import NextAuth from 'next-auth';

// Simple auth config that redirects to admin for authentication
export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [], // No local providers - redirect to admin
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth/signin', // Custom sign-in page that redirects to admin
    },
    callbacks: {
        async jwt({ token, account, user }) {
            // Handle tokens from admin app redirect
            return token;
        },
        async session({ token, session }) {
            // Pass through session data from admin app
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Handle redirects from admin app back to docs
            if (url.startsWith(process.env.NEXT_PUBLIC_ADMIN_URL)) {
                return url;
            }
            if (url.startsWith("/")) {
                return `${baseUrl}${url}`;
            }
            return baseUrl;
        }
    }
});