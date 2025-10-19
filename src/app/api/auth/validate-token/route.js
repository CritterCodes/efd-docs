import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        console.log('🔐 [VALIDATE TOKEN] Request received');
        
        const { token } = await request.json();
        if (!token) {
            console.log('❌ [VALIDATE TOKEN] No token provided');
            return NextResponse.json({ error: 'No token provided' }, { status: 400 });
        }

        console.log('🔐 [VALIDATE TOKEN] Validating token...');

        // Verify the token using the same secret as admin
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
        
        console.log('✅ [VALIDATE TOKEN] Token valid:', decoded.email);
        
        // Return the user session data
        const sessionData = {
            user: {
                id: decoded.userId,
                email: decoded.email,
                name: decoded.name,
                role: decoded.role
            }
        };

        return NextResponse.json({ valid: true, session: sessionData });
    } catch (error) {
        console.error('💥 [VALIDATE TOKEN] Error:', error);
        if (error.name === 'TokenExpiredError') {
            return NextResponse.json({ error: 'Token expired' }, { status: 401 });
        } else if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Token validation failed' }, { status: 500 });
    }
}