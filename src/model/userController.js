const Schema = require('./Schema');
const bcrypt = require('bcrypt')

// Create New User
async function createUser(firstname, lastname, email, password, isTechnician) {
    try {
        const existingUser = await Schema.User.findOne({ email }).exec();
        if (existingUser) {
            throw new Error('User already exists!');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await Schema.User.create({
            email,
            firstname,
            lastname,
            password: hashedPassword,
            lastLogin: new Date(), 
            isTechnician: isTechnician
        });

        console.log('Registration successful!');
        return newUser;

    } catch (error) {
        console.error('Error creating user:', error.message);
        throw error; 
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

async function isExistingUser(email) {
    try {
        const user = await Schema.User.findOne({ email }).exec();
        if (!user) {
            console.log('No User with email found!');
            return false;
        }
        return true;
    } catch (err) {
        console.error("Error fetching user:", err);
        return null;
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
       
        // Update last login time and remember me
        user.lastLogin = Date.now();
        await user.save();

        return user;
    } catch (err) {
        console.error("Error fetching user:", err);
        return null;
    }
}

async function updateAboutInfo(email, aboutInfo) {
    try {
        const user = await Schema.User.findOne({ email }).exec();
        if (!user) return null;

        user.aboutInfo = aboutInfo;
        await user.save();
        return user;
    } catch (err) {
        console.error("Error updating about info:", err);
        throw err;
    }
}


// Delete user
async function deleteUser(id) {
    try {
        console.log(`Deleting user with ID: ${id}`);

        const user = await Schema.User.findByIdAndDelete(id).exec();

        if (!user) {
            console.log('User not found.');
            return { success: false, message: 'User not found' };
        }

        console.log('User deleted successfully.');
        return { success: true, message: 'User deleted successfully' };

    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, message: error.message };
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
    isExistingUser,
    getUser,
    updateAboutInfo,
    deleteUser,
    getAnnouncements
};


