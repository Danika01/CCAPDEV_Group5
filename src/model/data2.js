const Schema = require('./Schema');
// used in login
async function getAllUsers() {
    try {
        const users = await Schema.User.find().exec();
        return  res.json(users);
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return [];
    }
} 
module.exports.getAllUsers = getAllUsers;

async function getUserData(email) {
    try {
        const user = await Schema.User.findOne({email: email}).exec();
        return res.json(user);
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return {};
    }
} 
module.exports.getUserData = getUserData;

async function getAnnouncements() {
    try {
        const announcements = await Schema.Announcement.find().exec();
        return res.json(announcements);
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return [];
    }
} 
module.exports.getAnnouncements = getAnnouncements;

async function getUnavailableRooms() {
    try {
        const unavailableRooms = await Schema.Unavailableroom.find().exec();
        return res.json(unavailableRooms);
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return [];
    }
} 
module.exports.getUnavailableRooms = getUnavailableRooms;

async function getReservationData() {
    try {
        const reservations = await Schema.Reservation.find().exec();
        return res.json(reservations);
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return [];
    }
} 
module.exports.getReservationData = getReservationData;


async function getSeatData() {
    try {
        const seats = await Schema.Seat.find().exec();
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return [];
    }
} 
module.exports.getSeatData = getSeatData;

async function getLaboratories() {
    try {
        const laboratories = await Schema.Lab.find().exec();
        return res.json(laboratories);
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return [];
    }
} 
module.exports.getLaboratories = getLaboratories;

async function getBuildings(req, res) {
    try {
        const buildings = await Schema.Lab.aggregate([
            {
                $match: {building}
            }
        ]).exec();
        return res.json(buildings);
    } catch (err) {
        console.error('Error reading or parsing data.json:', err);
        return [];
    }
}
module.exports.getBuildings = getBuildings;
