import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
// Some environments prefer named imports for bcryptjs
const { genSalt, hash, compare } = bcrypt;

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
        select: false, // Don't return password by default
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, {
    timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await genSalt(10);
        this.password = await hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
