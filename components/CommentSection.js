'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Send, User as UserIcon, MessageSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CommentSection({ postSlug }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [postSlug]);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/posts/${postSlug}/comments`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setComments(data);
            }
        } catch (err) {
            console.error('Failed to fetch comments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/posts/${postSlug}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment }),
            });

            if (res.ok) {
                const addedComment = await res.json();
                setComments([addedComment, ...comments]);
                setNewComment('');
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to post comment.');
            }
        } catch (err) {
            console.error('Submit error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-16 pt-12 border-t border-gray-100 dark:border-gray-900">
            <div className="flex items-center space-x-3 mb-10">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Comments <span className="text-gray-400 font-medium ml-1">({comments.length})</span>
                </h2>
            </div>

            {/* Comment Form */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-6 md:p-8 mb-12 border border-gray-100 dark:border-gray-800/50">
                {user ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</span>
                        </div>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="What are your thoughts on this guide?"
                            rows={4}
                            className="w-full px-5 py-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600 text-sm leading-relaxed"
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting || !newComment.trim()}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 px-6 rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                            >
                                {submitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                <span>Post Comment</span>
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-gray-600 dark:text-gray-400 font-medium mb-4">You must be logged in to leave a comment.</p>
                        <Link
                            href="/login"
                            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                        >
                            <span>Sign In to Comment</span>
                        </Link>
                    </div>
                )}
            </div>

            {/* Comment List */}
            <div className="space-y-8">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-400 font-medium">No comments yet. Be the first to start the conversation!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex space-x-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-50 dark:border-gray-800">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{comment.userName}</h4>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-950 p-4 rounded-2xl border border-gray-50 dark:border-gray-900 shadow-sm">
                                    {comment.content}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
