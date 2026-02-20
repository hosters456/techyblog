import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
        }

        // Check password
        console.log(`🔐 Verifying password for user: ${email}`);
        if (typeof user.comparePassword !== 'function') {
            throw new Error('user.comparePassword is not a function - model recreation might be needed');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('❌ Invalid credentials (password mismatch)');
            return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
        }

        // Generate JWT
        console.log('🔐 Generating JWT...');
        const token = await signJWT({ id: user._id.toString(), name: user.name, email: user.email, role: user.role });

        // Set cookie
        console.log('🍪 Setting authentication cookie...');
        const cookieStore = await cookies();
        if (typeof cookieStore.set !== 'function') {
            throw new Error('cookieStore.set is not a function - check next/headers');
        }

        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return NextResponse.json({
            success: true,
            user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
