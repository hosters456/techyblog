'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminPostForm from '@/components/AdminPostForm';
import { Loader2 } from 'lucide-react';

export default function EditPostPage() {
    const params = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/posts/${params.slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setPost(data);
                }
            } catch (err) {
                console.error('Failed to fetch post:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Post not found</h2>
                <p className="text-gray-500 mt-2">The post you are trying to edit does not exist.</p>
            </div>
        );
    }

    return (
        <div className="py-6">
            <AdminPostForm initialData={post} isEditing={true} />
        </div>
    );
}
