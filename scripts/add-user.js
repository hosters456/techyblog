const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

/**
 * User Schema copy (to avoid ES module issues in a quick script)
 */
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function addUser() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ Error: MONGODB_URI not found in .env.local');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB.');

        const args = process.argv.slice(2);
        if (args.length < 3) {
            console.log('\nUsage: node scripts/add-user.js <name> <email> <password> [role]');
            console.log('Example: node scripts/add-user.js "Admin User" admin@techyblog.top mysecretpassword admin\n');
            process.exit(0);
        }

        const [name, email, password, role = 'user'] = args;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error(`❌ Error: User with email ${email} already exists.`);
            process.exit(1);
        }

        const newUser = await User.create({ name, email, password, role });
        console.log(`\n🎉 Successfully added user:`);
        console.log(`- ID: ${newUser._id}`);
        console.log(`- Name: ${newUser.name}`);
        console.log(`- Email: ${newUser.email}`);
        console.log(`- Role: ${newUser.role}\n`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

addUser();
