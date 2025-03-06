const fs = require('fs');
const User = require('../src/model/Schemas/User');
const Building = require('../src/model/Schemas/Building');
const Reservation = require('src/model/Schemas/Reservation');
const Announcement = require('src/model/Schemas/Announcement');

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

// used in login.hbs
function getUnavailableRooms() {
    try {
        let rawdata = fs.readFileSync('./data.json');
        const data = JSON.parse(rawdata);
        return data.unavailableRooms || [];
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return [];
    }
} module.exports.getUnavailableRooms = getUnavailableRooms;

function getReservationData() {
    try {
        const rawdata = fs.readFileSync('./data.json');
        const data = JSON.parse(rawdata);
        return data.reservations || []; // Return reservations array or an empty array if not found
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return [];  // Return an empty array if there's an error
    }
} module.exports.getReservationData = getReservationData;

/*
	getSeatData - used in room.hbs
        - no sample data yet in json file

	potential fields:
	- what building
	- what room
	-> status of each seat in room
		- seatNumber
			- free or reserved?
				- if reserved, anon or not?
					- if not anon:
					- profile link
					- username ng nagreserve

*/
function getSeatData() {
    try {
        let rawdata = fs.readFileSync('./data.json');
        return JSON.parse(rawdata);
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return [];
    }
} module.exports.getSeatData = getSeatData;
