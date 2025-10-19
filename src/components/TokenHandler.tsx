'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TokenHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        const token = searchParams.get('auth_token');
        
        if (token && !isValidating) {
            setIsValidating(true);
            console.log('🔐 [TOKEN HANDLER] Auth token found, validating...');
            
            // Validate the token with our API
            fetch('/api/auth/validate-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token })
            })
            .then(response => response.json())
            .then(data => {
                if (data.valid) {
                    console.log('✅ [TOKEN HANDLER] Token valid, storing session');
                    
                    // Store the session data in localStorage for now
                    localStorage.setItem('centralizedAuth', JSON.stringify({
                        session: data.session,
                        timestamp: Date.now()
                    }));
                    
                    // Remove the token from URL and redirect to clean dashboard
                    const url = new URL(window.location.href);
                    url.searchParams.delete('auth_token');
                    router.replace(url.pathname + url.search);
                } else {
                    console.error('❌ [TOKEN HANDLER] Token validation failed:', data.error);
                    router.replace('/auth/signin?error=invalid_token');
                }
            })
            .catch(error => {
                console.error('💥 [TOKEN HANDLER] Token validation error:', error);
                router.replace('/auth/signin?error=validation_error');
            })
            .finally(() => {
                setIsValidating(false);
            });
        }
    }, [searchParams, router, isValidating]);

    if (isValidating) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Validating authentication...</p>
                </div>
            </div>
        );
    }

    return null;
}