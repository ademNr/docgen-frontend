import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { owner, repo, includeTests } = await req.json();
    const token = req.headers.get('authorization')?.split(' ')[1];
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';;

    if (!token) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const response = await fetch(`${backendUrl}/api/generate-docs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ owner, repo, includeTests }),
        });

        if (!response.ok) {
            throw new Error('Documentation generation failed');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Documentation generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate documentation' },
            { status: 500 }
        );
    }
}