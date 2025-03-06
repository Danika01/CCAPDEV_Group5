const User = require('/src/model/Schemas/User');
const Building = require('/src/model/Schemas/Building');
const Reservation = require('src/model/Schemas/Reservation');
const Announcement = require('src/model/Schemas/Announcement');

// used in login
async function getAllUsers (req, res) {
    const users = await User.find();
    if (!users) return res.status(204).json({'message': 'No users found.'});
    res.json(users);
}
module.exports.getAllUsers = getAllUsers;

async function getUserData(req, res) {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Email required.' });

    const user = await User.findOne({_id: req.params.id}).exec();
    if (!user) {
        return res.status(204).json({ "message": `No email matches ID ${req.params.id}.` });
    }
    res.json(user);
}
module.exports.getUserData = getUserData;

async function getAnnouncements(req, res) {
    const announcements = await Announcement.find();
    if (!announcements) return  res.status(204).json({'message': 'No announcements found.'});
    res.json(announcements);
}
module.exports.getAnnouncements = getAnnouncements;

function getUnavailableRooms() {
    try {
        const rawdata = fs.readFileSync(dataPath);
        const data = JSON.parse(rawdata);
        return data.unavailableRooms || [];
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return [];
    }
} 
module.exports.getUnavailableRooms = getUnavailableRooms;

function getReservationData() {
    try {
        const rawdata = fs.readFileSync(dataPath);
        const data = JSON.parse(rawdata);
        return data.reservations || [];
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return [];
    }
} 
module.exports.getReservationData = getReservationData;


function getSeatData() {
    try {
        const rawdata = fs.readFileSync(dataPath);
        const jsonData = JSON.parse(rawdata);
        return jsonData.seats; // return only the seats array
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return [];
    }
}
module.exports.getSeatData = getSeatData;

function getLaboratories() {
    try {
        const rawdata = fs.readFileSync(dataPath);
        const data = JSON.parse(rawdata);
        return data.laboratories || [];
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return [];
    }
} 
module.exports.getLaboratories = getLaboratories;
