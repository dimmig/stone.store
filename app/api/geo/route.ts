import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Get country from request headers
        const country = request.headers.get('x-vercel-ip-country') || 
                       request.geo?.country || 
                       'Unknown';

        // Get additional geo information
        const city = request.geo?.city || 'Unknown';
        const region = request.geo?.region || 'Unknown';
        const latitude = request.geo?.latitude || 0;
        const longitude = request.geo?.longitude || 0;

        return NextResponse.json({
            country,
            city,
            region,
            latitude,
            longitude,
            ip: request.ip || 'Unknown'
        });
    } catch (error) {
        console.error('[Geo API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to get location information' },
            { status: 500 }
        );
    }
} 