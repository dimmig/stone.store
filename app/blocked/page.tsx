'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCountryName } from '@/lib/utils/geo';

interface GeoData {
    country: string;
    city: string;
    region: string;
    latitude: number;
    longitude: number;
    ip: string;
}

export default function BlockedPage() {
    const router = useRouter();
    const [geoData, setGeoData] = useState<GeoData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get user's country from the API
        fetch('/api/geo')
            .then(res => res.json())
            .then(data => {
                setGeoData(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-8">
                    <svg 
                        className="mx-auto h-16 w-16 text-red-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Access Restricted
                </h1>

                <p className="text-gray-600 mb-6">
                    {loading ? (
                        'Checking your location...'
                    ) : geoData?.country ? (
                        `We're sorry, but access to this website is currently restricted to users from the European Union and Ukraine. Your location (${getCountryName(geoData.country)}) is not in the allowed region.`
                    ) : (
                        'We\'re sorry, but access to this website is currently restricted to users from the European Union and Ukraine.'
                    )}
                </p>

                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        If you believe this is a mistake or need assistance, please contact our support team.
                    </p>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
} 