const mongoose = require('mongoose');
const Schema = require('./Schema.js');


// ✅ Used in login - Get all users
async function getAllUsers() {
    try {
        const users = await Schema.User.find().exec();
        return users.length ? users : null;
    } catch (err) {
        console.error("Error fetching users:", err);
        return null;
    }
}
module.exports.getAllUsers = getAllUsers;


// ✅ Get user data by email (Fixed req.params usage)
async function getUserData({ email }) {
    try {
        const user = await Schema.User.findOne({ email }).exec();
        return user ? user : null;
    } catch (err) {
        console.error("Error fetching user data:", err);
        return null;
    }
}
module.exports.getUserData = getUserData;


// ✅ Get all announcements
async function getAnnouncements() {
    try {
        const announcements = await Schema.Announcement.find().exec();
        return announcements.length ? announcements : null;
    } catch (err) {
        console.error("Error fetching announcements:", err);
        return null;
    }
}
module.exports.getAnnouncements = getAnnouncements;


// ✅ Get unavailable rooms (Fix `$unwind` error)
async function getUnavailableRooms() {
    try {
        const unavailable = await Schema.Lab.aggregate([
            {
                $lookup: {
                    from: 'seat',
                    localField: '_id',
                    foreignField: 'lab',
                    as: 'seats'
                }
            },
            {
                $lookup: {
                    from: 'reservation',
                    localField: 'seats._id',
                    foreignField: 'seatsId',
                    as: 'reservations'
                }
            },
            {
                $addFields: {
                    totalSeats: { $size: '$seats' },
                    reservedSeats: {
                        $size: {
                            $filter: {
                                input: '$reservations',
                                as: 'res',
                                cond: { $eq: ['$$res.availability', false] }
                            }
                        }
                    }
                }
            },
            {
                $match: { $expr: { $eq: ['$totalSeats', '$reservedSeats'] } }
            },
            {
                $lookup: {
                    from: 'building',
                    localField: 'buildingId',
                    foreignField: '_id',
                    as: 'building'
                }
            },
            { $unwind: '$building' },
            {
                $project: {
                    _id: 0,
                    buildingName: '$building.name',
                    labName: '$name'
                }
            }
        ]).exec();

        return unavailable;
    } catch (err) {
        console.error("Error fetching unavailable rooms:", err);
        return [];
    }
}
module.exports.getUnavailableRooms = getUnavailableRooms;


// ✅ Get reservation data (Fixed population)
async function getReservationData(id) {
    try {
        const reservation = await Schema.Reservation.findById(id).populate("seatId").exec();
        return reservation ? reservation : null;
    } catch (err) {
        console.error("Error fetching reservation data:", err);
        return null;
    }
}
module.exports.getReservationData = getReservationData;


// ✅ Get seat data
async function getSeatData(id) {
    try {
        const seatData = await Schema.Seat.findById(id).exec();
        return seatData ? seatData : null;
    } catch (err) {
        console.error("Error fetching seat data:", err);
        return null;
    }
}
module.exports.getSeatData = getSeatData;


// ✅ Get all labs
async function getLaboratories() {
    try {
        const labs = await Schema.Lab.find().exec();
        return labs;
    } catch (err) {
        console.error("Error fetching labs:", err);
        return [];
    }
} 
module.exports.getLaboratories = getLaboratories;


// ✅ Get labs by building name (Fixed `req.params` usage)
async function getLabsInBuilding(buildingName) {
    try {
        const laboratories = await Schema.Lab.aggregate([
            {
                $lookup: {
                    from: 'building',
                    localField: 'buildingId',
                    foreignField: '_id',
                    as: 'building'
                }
            },
            {
                $match: { 'building.name': buildingName }
            }
        ]).exec();

        return laboratories;
    } catch (err) {
        console.error("Error fetching labs in building:", err);
        return [];
    }
}
module.exports.getLabsInBuilding = getLabsInBuilding;


// ✅ Get all buildings
async function getBuildings() {
    try {
        const buildings = await Schema.Building.find().exec();
        return buildings;
    } catch (err) {
        console.error("Error fetching buildings:", err);
        return [];
    }
}
module.exports.getBuildings = getBuildings;
