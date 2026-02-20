import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import { getSession } from '@/lib/auth';

export async function GET(request, { params }) {
    console.log('🚀 Fetching comments...');
    try {
        await dbConnect();
        const { slug } = await params;
        console.log(`📝 Finding post with slug: ${slug}`);

        const post = await Post.findOne({ slug });
        if (!post) {
            console.log('❌ Post not found');
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        console.log(`✅ Post found, fetching comments for: ${post._id}`);
        const comments = await Comment.find({ post: post._id })
            .sort({ createdAt: -1 })
            .populate('user', 'name');

        console.log(`🎉 Found ${comments.length} comments`);
        return NextResponse.json(comments);
    } catch (error) {
        console.error('💥 Fetch Comments Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    console.log('🚀 Posting a new comment...');
    try {
        await dbConnect();
        const { slug } = await params;

        console.log('🔐 Getting user session...');
        const user = await getSession();
        if (!user) {
            console.log('❌ Unauthorized');
            return NextResponse.json({ error: 'Unauthorized. Please log in to comment.' }, { status: 401 });
        }

        const { content } = await request.json();
        if (!content) {
            console.log('❌ Missing content');
            return NextResponse.json({ error: 'Comment content is required.' }, { status: 400 });
        }

        console.log(`📝 Finding post: ${slug}`);
        const post = await Post.findOne({ slug });
        if (!post) {
            console.log('❌ Post not found');
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        console.log('⏳ Creating comment in DB...');
        const comment = await Comment.create({
            content,
            post: post._id,
            user: user.id,
            userName: user.name,
        });

        console.log('🎉 Comment posted successfully');
        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error('💥 Post Comment Error:', error);
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
