import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import slugify from 'slugify';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const tag = searchParams.get('tag');
        const search = searchParams.get('search');

        let query = {};
        if (tag) {
            query.tags = tag;
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
            ];
        }

        const posts = await Post.find(query).sort({ createdAt: -1 });
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const adminSecret = request.headers.get('x-admin-secret');
        if (adminSecret !== process.env.ADMIN_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const data = await request.json();

        if (!data.slug && data.title) {
            data.slug = slugify(data.title, { lower: true, strict: true });
        }

        const post = await Post.create(data);
        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
