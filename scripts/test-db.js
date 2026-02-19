const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function testConnection() {
    const uri = process.env.MONGODB_URI;
    console.log('Attempting to connect to MongoDB...');
    console.log('URI:', uri.replace(/\/\/.*@/, '//****:****@')); // Hide credentials

    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ MongoDB connected successfully!');

        // List collections as a final check
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ MongoDB connection failed:');
        console.error(err.message);
        process.exit(1);
    }
}

testConnection();
