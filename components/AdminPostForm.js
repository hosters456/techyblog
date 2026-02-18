'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Trash, Tag as TagIcon, Plus, Loader2 } from 'lucide-react';

export default function AdminPostForm({ initialData = null, isEditing = false }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        author: initialData?.author || 'Ashish Choudhary',
        tags: initialData?.tags || [],
        slug: initialData?.slug || '',
    });

    const [currentTag, setCurrentTag] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const addTag = () => {
        if (currentTag && !formData.tags.includes(currentTag)) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, currentTag],
            }));
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tagToRemove),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const secret = localStorage.getItem('admin_secret');
            const url = isEditing ? `/api/posts/${initialData.slug}` : '/api/posts';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-secret': secret,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {isEditing ? 'Edit Post' : 'Create New Post'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {isEditing ? `Updating "${initialData.title}"` : 'Share your knowledge with the world.'}
                    </p>
                </div>
                <div className="flex space-x-3 w-full md:w-auto">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 md:flex-none border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold py-2.5 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center justify-center space-x-2"
                    >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span>{isEditing ? 'Save Changes' : 'Publish Post'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Editor Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2 uppercase tracking-widest text-[10px]">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full text-2xl font-bold bg-transparent border-none focus:ring-0 placeholder-gray-300 dark:placeholder-gray-700 p-0 text-gray-900 dark:text-white"
                                    placeholder="Enter a compelling title..."
                                />
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2 uppercase tracking-widest text-[10px]">Content (HTML/Markdown Supported)</label>
                                <textarea
                                    name="content"
                                    required
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows={15}
                                    className="w-full bg-transparent border-none focus:ring-0 placeholder-gray-300 dark:placeholder-gray-700 p-0 text-gray-600 dark:text-gray-300 resize-none font-mono text-sm leading-relaxed"
                                    placeholder="Write your guide here... HTML tags like <h2>, <p>, and <code> are recommended."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings Section */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                            <span>Publication Settings</span>
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Excerpt</label>
                                <textarea
                                    name="excerpt"
                                    required
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    rows={3}
                                    maxLength={300}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-white resize-none outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Short summary of the post..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Author</label>
                                <input
                                    type="text"
                                    name="author"
                                    required
                                    value={formData.author}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tags</label>
                                <div className="flex space-x-2 mb-3">
                                    <input
                                        type="text"
                                        value={currentTag}
                                        onChange={(e) => setCurrentTag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="Add a tag..."
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-2 hover:text-blue-800 dark:hover:text-blue-200"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
