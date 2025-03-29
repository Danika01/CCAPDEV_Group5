const Schema = require('./Schema');

async function getBuildings() {
    try {
        return await Schema.Building.find().exec();
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

async function getSeats() {
    try {
        return await Schema.Seat.find().exec();
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

async function getSeatsByBuilding(buildingId) {
    try {
        const seats = await Schema.Lab.find({"building": ObjectId(buildingId)}).populate('seats').exec();
        console.log('Seats found!');
        return seats;
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

async function getSeatsByLab(labId) {
    try {
        const seats = await Schema.Lab.findById({labId}).populate('seats').exec();
        console.log('Seats found!');
        return seats;
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

async function getLabs() {
    try {
        return await Schema.Lab.find().exec();
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

async function getUnavailableLabs() {
    try {
        return await Schema.Lab.find({available: false}).exec();
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

async function getAnnouncements() {
    try {
        return await Schema.Announcement.find().lean().exec();
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

module.exports = {
    getBuildings,
    getSeats,
    getLabs,
    getSeatsByLab,
    getSeatsByBuilding,
    getUnavailableLabs,
    getAnnouncements
}