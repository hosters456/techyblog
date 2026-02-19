import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import { getSession } from '@/lib/auth';

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const post = await Post.findOne({ slug: params.slug });
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const comments = await Comment.find({ post: post._id })
            .sort({ createdAt: -1 })
            .populate('user', 'name');

        return NextResponse.json(comments);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        await dbConnect();
        const user = await getSession();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized. Please log in to comment.' }, { status: 401 });
        }

        const { content } = await request.json();
        if (!content) {
            return NextResponse.json({ error: 'Comment content is required.' }, { status: 400 });
        }

        const post = await Post.findOne({ slug: params.slug });
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const comment = await Comment.create({
            content,
            post: post._id,
            user: user.id,
            userName: user.name,
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const secret = request.headers.get('x-admin-secret');
        if (secret !== process.env.ADMIN_SECRET) {
            return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
        }

        const { commentId } = await request.json();
        if (!commentId) {
            return NextResponse.json({ error: 'Comment ID is required.' }, { status: 400 });
        }

        const result = await Comment.findByIdAndDelete(commentId);
        if (!result) {
            return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
