'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function CentralizedSignIn() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    
    useEffect(() => {
        // Redirect to admin app for authentication
        const adminAuthUrl = `${process.env.NEXT_PUBLIC_ADMIN_URL}/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`;
        window.location.href = adminAuthUrl;
    }, [callbackUrl]);
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Redirecting to Authentication
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Please wait while we redirect you to the admin panel for authentication...
                    </p>
                    <div className="mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                    <p className="mt-4 text-xs text-gray-500">
                        If you are not redirected automatically, 
                        <a 
                            href={`${process.env.NEXT_PUBLIC_ADMIN_URL}/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                            className="text-blue-600 hover:text-blue-500 ml-1"
                        >
                            click here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}