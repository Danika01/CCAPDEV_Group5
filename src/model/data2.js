const Schema = require("./Schema");
const { Lab } = require('./Schema');  // 👈 Import Lab model


// Get all users
async function getAllUsers() {
    try {
        return await Schema.User.find().exec();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}
module.exports.getAllUsers = getAllUsers;

// Get a single user by email
async function getUserData(email) {
    try {
        const user = await Schema.User.findOne({ email: email }).exec();
        console.log("Found user:", user);  // 🔍 Debugging
        return user;  // ✅ Now it correctly returns the user object
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
} 

module.exports.getUserData = getUserData;

// Get announcements
async function getAnnouncements() {
    try {
        return await Schema.Announcement.find().exec();
    } catch (error) {
        console.error("Error fetching announcements:", error);
        return [];
    }
}
module.exports.getAnnouncements = getAnnouncements;

// Get unavailable rooms
async function getUnavailableRooms() {
    try {
        return await Schema.Unavailableroom.find().exec();
    } catch (error) {
        console.error("Error fetching unavailable rooms:", error);
        return [];
    }
}
module.exports.getUnavailableRooms = getUnavailableRooms;

// Get reservations
async function getReservationData(email) {
    try {
        const reservations = await Schema.Reservation.find({ email: email }).lean().exec(); 
        console.log("Reservations from DB:", reservations); // Debugging
        return reservations;
    } catch (error) {
        console.error("Error fetching reservations:", error);
        return [];
    }
}

module.exports.getReservationData = getReservationData;


// Get seat data
async function getSeatData() {
    try {
        return await Schema.Seat.find().exec();
    } catch (error) {
        console.error("Error fetching seat data:", error);
        return [];
    }
}
module.exports.getSeatData = getSeatData;

// Get all laboratories
async function getLaboratories() {
    try {
        return await Schema.Lab.find().exec();
    } catch (error) {
        console.error("Error fetching laboratories:", error);
        return [];
    }
}
module.exports.getLaboratories = getLaboratories;

// Get unique building names
async function getBuildings() {
    try {
        const buildings = await Lab.distinct("building").exec();  // ✅ Uses correct collection
        console.log("Buildings found:", buildings);  // ✅ Debugging log
        return buildings;
    } catch (error) {
        console.error("Error fetching buildings:", error);
        return [];
    }
}
module.exports.getBuildings = getBuildings;

// Get laboratories in a specific building
async function getLabsInBuilding(buildingName) {
    try {
        console.log("Fetching labs for building:", buildingName);
        const labs = await Lab.find({ building: buildingName }).exec();
        console.log("Labs found:", labs); 
        return labs;
    } catch (error) {
        console.error("Error fetching labs in building:", error);
        return [];
    }
}

module.exports.getLabsInBuilding = getLabsInBuilding;
