import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this post.'],
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: {
        type: String,
        required: [true, 'Please provide a slug for this post.'],
        unique: true,
    },
    excerpt: {
        type: String,
        required: [true, 'Please provide an excerpt for this post.'],
        maxlength: [300, 'Excerpt cannot be more than 300 characters'],
    },
    content: {
        type: String,
        required: [true, 'Please provide content for this post.'],
    },
    author: {
        type: String,
        required: [true, "Please provide the author's name."],
        default: 'Ashish Choudhary',
    },
    tags: {
        type: [String],
        default: [],
    },
    featuredImage: {
        type: String,
    }
}, {
    timestamps: true,
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
