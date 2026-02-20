import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
    console.log('🚀 Signup attempt started...');
    try {
        await dbConnect();
        const body = await request.json();
        const { name, email, password } = body;
        console.log(`📝 Attempting to create user: ${email}`);

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('❌ User already exists');
            return NextResponse.json({ error: 'User already exists with this email' }, { status: 400 });
        }

        // Create user
        console.log('⏳ Hashing password manually in route...');
        const b = (await import('bcryptjs')).default || (await import('bcryptjs'));
        const salt = await b.genSalt(10);
        const hashedPassword = await b.hash(password, salt);
        console.log('✅ Password hashed successfully');

        console.log('⏳ Saving user to database...');
        const user = await User.create({ name, email, password: hashedPassword });
        console.log('✅ User created successfully');

        // Generate JWT
        console.log('🔐 Generating JWT...');
        if (typeof signJWT !== 'function') {
            throw new Error('signJWT is not a function - check lib/auth.js');
        }
        const token = await signJWT({ id: user._id, name: user.name, email: user.email, role: user.role });

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

        console.log('🎉 Signup completed successfully');
        return NextResponse.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        }, { status: 201 });

    } catch (error) {
        console.error('💥 Signup Error:', error);
        return NextResponse.json({
            error: error.message || 'Internal Server Error',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
