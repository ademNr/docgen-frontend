import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { code } = await req.json();

    try {

        const response = await fetch(`https://github.com/login/oauth/access_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });

        if (!response.ok) {
            throw new Error('GitHub authentication failed');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('GitHub auth error:', error);
        return NextResponse.json(
            { error: 'Authentication service unavailable' },
            { status: 500 }
        );
    }
}