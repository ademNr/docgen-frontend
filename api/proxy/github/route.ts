// app/api/proxy/github/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';;
        const { code } = await req.json();
        const backendResponse = await fetch(`${backendUrl}/api/auth/github`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });

        if (!backendResponse.ok) {
            throw new Error('Token exchange failed');
        }

        const data = await backendResponse.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('GitHub auth error:', error);
        return NextResponse.json(
            { error: 'Authentication service unavailable' },
            { status: 500 }
        );
    }
}