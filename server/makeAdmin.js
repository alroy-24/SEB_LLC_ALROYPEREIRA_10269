require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function makeAdmin(userEmail) {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const user = await User.findOneAndUpdate(
            { email: "pereiraalroy24@gmail.com" },
            { $set: { role: "admin" } },
            { new: true }
        );

        if (user) {
            console.log(`Successfully made ${userEmail} an admin!`);
            console.log('Updated user:', user);
        } else {
            console.log(`User with email ${userEmail} not found`);
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
}

makeAdmin("pereiraalroy24@gmail.com");
