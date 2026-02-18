import { notFound } from 'next/navigation';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

async function getPost(slug) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/posts/${slug}`, {
        cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function PostPage({ params }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <article className="container mx-auto px-4 py-16 max-w-4xl">
            <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mb-12 group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to all posts
            </Link>

            <header className="mb-12">
                <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 text-sm gap-6 border-y border-gray-200 dark:border-gray-800 py-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {post.author.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{post.author}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </header>

            <div
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <section className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-800 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Enjoyed this article?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Stay tuned for more beginner-friendly programming guides.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                >
                    Explore More Posts
                </Link>
            </section>
        </article>
    );
}
