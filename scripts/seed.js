const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const PostSchema = new mongoose.Schema({
    title: String,
    slug: String,
    excerpt: String,
    content: String,
    author: String,
    tags: [String],
}, { timestamps: true });

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

async function seed() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        console.error('Error: MONGODB_URI not found in .env.local');
        process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB...');

    const samplePost = {
        title: "Getting Started with TechyBlog",
        slug: "getting-started-with-techyblog",
        excerpt: "Welcome to TechyBlog! Learn how this platform helps you master programming.",
        content: "<h2>Hello World!</h2><p>This is your first blog post. TechyBlog is designed to help beginners understand complex technical concepts in a simple way.</p><p>You can edit or delete this post using the API or directly in MongoDB.</p>",
        author: "Ashish Choudhary",
        tags: ["Programming", "Beginner", "Next.js"],
    };

    await Post.deleteMany({}); // Optional: clear existing
    await Post.create(samplePost);

    console.log('Successfully seeded database with sample post!');
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
