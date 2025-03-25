const Schema = require('./Schema');
const bcrypt = require('bcrypt')

// Create New User / Register
async function createUser(firstname, lastname, email, password)
{
    try{
        const existingUser = await Schema.User.findOne({email}).exec();
        if(existingUser) {
            throw new Error('User already exists!');
        }
        // if new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Schema.User.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword
        });

        newUser.save(); // save new user
        console.log('Registration successful!');
    } catch(error) {
        console.error('Error creating user:', error.message);
    }

}

async function getAllUsers() {
    try {
        return await Schema.User.find().exec();
    } catch (err) {
        console.error("Error fetching users:", err);
        return [];
    }
}

async function getUser(email, password) {
    try {
        const user = await Schema.User.findOne({ email }).exec();
        if (!user) {
            console.log('No User with email found!');
            return null;
        }

        
        // Compare hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log('Invalid password!');
            return null;
        } 
        
/*
        if (password !== user.password) {
            console.log('Invalid password!');
            return null;
        }
*/
        // Update last login time
        user.lastLogin = Date.now();
        await user.save();

        return user;
    } catch (err) {
        console.error("Error fetching user:", err);
        return null;
    }
}



async function updateAboutInfo() {
    try {
        const newInfo = await Schema.User.findOne({_id: req.body.id}).exec();
        newInfo.aboutInfo = req.body.aboutInfo;
        const result = await newInfo.save();
        return result;
    } catch (err) {
        console.error("Error updating info:", error);
        return [];
    }
}

// Delete user
async function deleteUser()
{
    try {
        const user = await Schema.User.findOne({_id: req.body.id}).exec();
        console.log('User found.');
        const result = user.deleteOne();
        console.log('User deleted successfully.');
    } catch(error) {
        console.error('Error deleting user:', error.message);
        throw error;
    }
}

async function getAnnouncements() {
    try {
        return await Schema.Announcement.find().lean().exec();
    } catch (error) {
        console.error("Error fetching announcements:", error);
        return [];
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getUser,
    updateAboutInfo,
    deleteUser,
    getAnnouncements
};


