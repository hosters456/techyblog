import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { secret } = await request.json();

        if (secret === process.env.ADMIN_SECRET) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
