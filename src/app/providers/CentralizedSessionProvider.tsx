'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Session {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}

interface SessionContextType {
    data: Session | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
    signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function CentralizedSessionProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

    useEffect(() => {
        async function fetchSession() {
            try {
                console.log('🔒 [CENTRALIZED SESSION] Checking for stored session...');
                
                // First check if we have a stored session from token validation
                // Only access localStorage on client side
                if (typeof window !== 'undefined') {
                    const storedAuth = localStorage.getItem('centralizedAuth');
                    if (storedAuth) {
                        try {
                            const authData = JSON.parse(storedAuth);
                            const age = Date.now() - authData.timestamp;
                    
                            // If stored session is less than 30 minutes old, use it
                            if (age < 30 * 60 * 1000) {
                                console.log('✅ [CENTRALIZED SESSION] Using stored session:', authData.session.user.email);
                                setSession(authData.session);
                                setStatus('authenticated');
                                return;
                            } else {
                                console.log('⏰ [CENTRALIZED SESSION] Stored session expired, removing...');
                                localStorage.removeItem('centralizedAuth');
                            }
                        } catch (parseError) {
                            console.error('💥 [CENTRALIZED SESSION] Error parsing stored session:', parseError);
                            localStorage.removeItem('centralizedAuth');
                        }
                    }
                }
                
                console.log('🔒 [CENTRALIZED SESSION] Fetching session from admin app...');
                console.log('🔒 [CENTRALIZED SESSION] Admin URL:', process.env.NEXT_PUBLIC_ADMIN_URL);
                
                // Try to get session from admin app
                const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/api/auth/session`, {
                    credentials: 'include', // Include cookies for cross-origin requests
                });
                
                console.log('🔒 [CENTRALIZED SESSION] Response status:', response.status);
                console.log('🔒 [CENTRALIZED SESSION] Response headers:', Object.fromEntries(response.headers.entries()));
                
                if (response.ok) {
                    const sessionData = await response.json();
                    console.log('🔒 [CENTRALIZED SESSION] Session data:', sessionData);
                    if (sessionData.user) {
                        setSession(sessionData);
                        setStatus('authenticated');
                        console.log('✅ [CENTRALIZED SESSION] User authenticated:', sessionData.user.email);
                    } else {
                        setSession(null);
                        setStatus('unauthenticated');
                        console.log('❌ [CENTRALIZED SESSION] No user in session data');
                    }
                } else {
                    console.log('❌ [CENTRALIZED SESSION] Response not OK:', response.status);
                    setSession(null);
                    setStatus('unauthenticated');
                }
            } catch (error) {
                console.error('💥 [CENTRALIZED SESSION] Error fetching session:', error);
                setSession(null);
                setStatus('unauthenticated');
            }
        }

        fetchSession();
    }, []);

    const signOut = async () => {
        try {
            // Clear stored session (only on client side)
            if (typeof window !== 'undefined') {
                localStorage.removeItem('centralizedAuth');
            }
            
            // Sign out from admin app
            await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/api/auth/signout`, {
                method: 'POST',
                credentials: 'include',
            });
            
            setSession(null);
            setStatus('unauthenticated');
            
            // Redirect to admin sign-in (only on client side)
            if (typeof window !== 'undefined') {
                window.location.href = `${process.env.NEXT_PUBLIC_ADMIN_URL}/auth/signin`;
            }
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const value = {
        data: session,
        status,
        signOut
    };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a CentralizedSessionProvider');
    }
    return context;
}