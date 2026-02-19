'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Trash2, ArrowLeft, MessageSquare, User, Calendar, Loader2, ShieldX } from 'lucide-react';
import { useAdmin } from '@/components/AdminContext';

export default function AdminComments({ params }) {
    const { slug } = use(params);
    const [comments, setComments] = useState([]);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAdmin();

    useEffect(() => {
        if (isAdmin && slug) {
            fetchData();
        }
    }, [isAdmin, slug]);

    const fetchData = async () => {
        try {
            // Fetch post details
            const postRes = await fetch(`/api/posts/${slug}`);
            if (postRes.ok) {
                const postData = await postRes.json();
                setPost(postData);
            }

            // Fetch comments
            const commentsRes = await fetch(`/api/posts/${slug}/comments`);
            if (commentsRes.ok) {
                const commentsData = await commentsRes.json();
                setComments(commentsData);
            }
        } catch (err) {
            console.error('Failed to fetch admin comment data:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteComment = async (commentId) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            const secret = localStorage.getItem('admin_secret');
            const res = await fetch(`/api/posts/${slug}/comments`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-secret': secret,
                },
                body: JSON.stringify({ commentId }),
            });

            if (res.ok) {
                setComments(comments.filter((c) => c._id !== commentId));
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete comment.');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('An error occurred while deleting.');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500">Loading comments...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Link
                href="/admin"
                className="inline-flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-8 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Dashboard</span>
            </Link>

            <div className="mb-10">
                <div className="flex items-center space-x-3 mb-2">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Post Comments</h1>
                </div>
                {post && (
                    <p className="text-gray-500 dark:text-gray-400">
                        Managing comments for: <span className="font-bold text-gray-900 dark:text-white">{post.title}</span>
                    </p>
                )}
            </div>

            {comments.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-16 text-center shadow-sm">
                    <div className="bg-gray-50 dark:bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">No comments yet</h3>
                    <p className="text-gray-500 mt-2">This post hasn't received any feedback yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                        Total Comments: {comments.length}
                    </p>
                    {comments.map((comment) => (
                        <div
                            key={comment._id}
                            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-sm font-black text-blue-600">
                                        {comment.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white leading-none mb-1">{comment.userName}</p>
                                        <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteComment(comment._id)}
                                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete Comment"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm bg-gray-50/50 dark:bg-gray-800/20 p-4 rounded-2xl">
                                {comment.content}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
