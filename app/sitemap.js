export default async function sitemap() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Fetch all posts to include them in the sitemap
    const res = await fetch(`${siteUrl}/api/posts`, {
        cache: 'no-store',
    });
    const posts = res.ok ? await res.json() : [];

    const postUrls = posts.map((post) => ({
        url: `${siteUrl}/posts/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.createdAt),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        ...postUrls,
    ];
}
