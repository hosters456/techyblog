import PostCard from '@/components/PostCard';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import { Suspense } from 'react';

async function getPosts(searchParams) {
  const query = new URLSearchParams(searchParams).toString();
  // Using absolute URL for server-side fetch in Next.js
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/posts?${query}`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home({ searchParams }) {
  const resolvedParams = await searchParams;
  const posts = await getPosts(resolvedParams);
  const currentTag = resolvedParams.tag;

  const tags = ['JavaScript', 'React', 'Next.js', 'Tailwind', 'Node.js', 'MongoDB'];

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
          Level Up Your <span className="text-blue-600">Coding</span> Skills.
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Clear, concise guides for beginners in programming and modern web development.
        </p>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <Suspense fallback={<div className="w-full max-w-md h-10 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />}>
          <SearchBar />
        </Suspense>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!currentTag
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            All
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/?tag=${tag}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentTag === tag
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No posts found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters.</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">Clear all filters</Link>
        </div>
      )}
    </div>
  );
}
