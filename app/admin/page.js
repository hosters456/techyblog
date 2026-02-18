'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit2, Trash2, ExternalLink, MoreVertical, Plus, Post as PostIcon } from 'lucide-react';
import { useAdmin } from '@/components/AdminContext';

export default function AdminDashboard() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAdmin();

    useEffect(() => {
        if (isAdmin) {
            fetchPosts();
        }
    }, [isAdmin]);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts');
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (slug) => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

        try {
            const secret = localStorage.getItem('admin_secret');
            const res = await fetch(`/api/posts/${slug}`, {
                method: 'DELETE',
                headers: {
                    'x-admin-secret': secret,
                },
            });

            if (res.ok) {
                setPosts(posts.filter((p) => p.slug !== slug));
            } else {
                alert('Failed to delete post. Check your secret/permissions.');
            }
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-500">Loading posts...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Post Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your blog content and publications.</p>
                </div>
                <Link
                    href="/admin/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl flex items-center space-x-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create New Post</span>
                </Link>
            </div>

            {posts.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-20 text-center">
                    <div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                        <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">No posts yet</h3>
                    <p className="text-gray-500 mt-2 mb-8">Start by creating your first technical guide.</p>
                    <Link href="/admin/new" className="text-blue-600 font-bold hover:underline">Click here to start</Link>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Title & Excerpt</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {posts.map((post) => (
                                <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {post.title}
                                            </span>
                                            <span className="text-sm text-gray-500 mt-1 line-clamp-1">{post.excerpt}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link
                                                href={`/posts/${post.slug}`}
                                                target="_blank"
                                                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                title="View Live"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/admin/edit/${post.slug}`}
                                                className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                                                title="Edit Post"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => deletePost(post.slug)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete Post"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
