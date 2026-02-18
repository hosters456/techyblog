import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import slugify from 'slugify';

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { slug } = await params;
        const post = await Post.findOne({ slug });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const adminSecret = request.headers.get('x-admin-secret');
        if (adminSecret !== process.env.ADMIN_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { slug } = await params;
        const data = await request.json();

        if (data.title) {
            data.slug = slugify(data.title, { lower: true, strict: true });
        }

        const post = await Post.findOneAndUpdate({ slug }, data, {
            new: true,
            runValidators: true,
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const adminSecret = request.headers.get('x-admin-secret');
        if (adminSecret !== process.env.ADMIN_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { slug } = await params;
        const post = await Post.findOneAndDelete({ slug });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Post deleted' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
