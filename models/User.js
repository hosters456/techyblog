import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email.'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email.'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: [6, 'Password must be at least 6 characters.'],
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, {
    timestamps: true,
});

// No pre-save hook here to avoid Next.js bundling/ESM issues.
// Hashing is now handled manually in API routes (signup, add-user).

UserSchema.methods.comparePassword = async function (candidatePassword) {
    // Robustly handle bcryptjs import differences
    const b = bcrypt.default || bcrypt;
    if (typeof b.compare !== 'function') {
        throw new Error('bcrypt.compare is not a function - check bcryptjs import/installation');
    }
    return await b.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
