const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json'); 

// used in login
function getAllUsers() {
    try {
        const rawdata = fs.readFileSync(dataPath);
        const data = JSON.parse(rawdata);
        return data.user || [];
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return [];
    }
} 
module.exports.getAllUsers = getAllUsers;

function getUserData(email) {
    try {
        const rawdata = fs.readFileSync(dataPath);
        const data = JSON.parse(rawdata);
        return data.user.find(user => user.email === email) || {};
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return {};
    }
} 
module.exports.getUserData = getUserData;

function getAnnouncements() {
    try {
        const rawdata = fs.readFileSync(dataPath);
        const data = JSON.parse(rawdata);
        return data.announcements || [];
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        return [];
    }
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
        return JSON.parse(rawdata);
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
