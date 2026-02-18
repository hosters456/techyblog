import Link from 'next/link';
import { Calendar, Tag, ArrowRight } from 'lucide-react';

export default function PostCard({ post }) {
    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="p-6">
                <div className="flex items-center space-x-2 text-xs font-medium text-blue-600 dark:text-blue-400 mb-3">
                    <Calendar className="w-3 h-3" />
                    <span>{formattedDate}</span>
                </div>

                <Link href={`/posts/${post.slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                    </h3>
                </Link>

                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-[10px] font-semibold tracking-wider font-mono"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                <Link
                    href={`/posts/${post.slug}`}
                    className="inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                    Read Full Story
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
