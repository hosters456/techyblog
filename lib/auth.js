import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only');

export async function signJWT(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);
}

export async function verifyJWT(token) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    const session = await verifyJWT(token);

    // Robustness check: Ensure id is a string, not a serialized ObjectId object
    if (session && session.id && typeof session.id === 'object' && session.id.buffer) {
        // This is a corrupted session from earlier bug, force relog or try to fix
        return null;
    }

    return session;
}
