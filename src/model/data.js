const fs = require('fs');
const path = require('path');

// used in login
function getAllUsers() {
    try {
        const rawdata = fs.readFileSync('./data.json');
        const data = JSON.parse(rawdata);
        return data.user || []; // Return the array of users or an empty array if not found
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return []; // Return an empty array if there's an error
    }
} module.exports.getAllUsers = getAllUsers;

function getUserData(email) {
    try {
        const rawdata = fs.readFileSync('./data.json');
        const data = JSON.parse(rawdata);
        const user = data.user.find(user => user.email === email); // Find user by email
        return user || {}; 
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return {}; 
    }
} module.exports.getUserData = getUserData;

/*
	getAnnouncements - used in login.hbs
            - sample data found in data.json
*/

function getAnnouncements() {
    try {
        let rawdata = fs.readFileSync('./data.json');
        const data = JSON.parse(rawdata);
        return data.announcements || []; // Return announcements or an empty array if not found
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return []; // Return an empty object if there's an error
    }
} module.exports.getAnnouncements = getAnnouncements;

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


// GET ONLY THE LABORATORIES
function getLaboratories() {
    try {
        const filePath = path.join(__dirname, '..', 'model', 'data.json');
        let rawdata = fs.readFileSync(filePath); 
        let data = JSON.parse(rawdata);
        return data.laboratories || [];
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return []; 
    }
} module.exports.getLaboratories = getLaboratories;

