const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Simple Schemas for seeding
const PostSchema = new mongoose.Schema({
    title: String,
    slug: String,
    excerpt: String,
    content: String,
    author: String,
    tags: [String],
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, default: 'user' },
}, { timestamps: true });

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        console.error('❌ Error: MONGODB_URI not found in .env.local');
        process.exit(1);
    }

    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected!');

        // 1. Seed Sample Post
        console.log('📝 Seeding posts...');
        await Post.deleteMany({});
        const samplePost = {
            title: "Getting Started with TechyBlog",
            slug: "getting-started-with-techyblog",
            excerpt: "Welcome to TechyBlog! Learn how this platform helps you master programming.",
            content: "<h2>Hello World!</h2><p>This is your first blog post. TechyBlog is designed to help beginners understand complex technical concepts in a simple way.</p><p>Explore our guides and start your journey!</p>",
            author: "Ashish Choudhary",
            tags: ["Programming", "Beginner", "Next.js"],
        };
        await Post.create(samplePost);

        // 2. Seed Admin User
        console.log('👤 Seeding admin user...');
        await User.deleteMany({});
        const hashedPassword = await bcrypt.hash('Shivam@2014', 10);
        await User.create({
            name: "Shivam",
            email: "admin@techyblog.top",
            password: hashedPassword,
            role: "admin"
        });

        console.log('\n🎉 Successfully migrated data and seeded MongoDB Atlas!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
}

seed();
