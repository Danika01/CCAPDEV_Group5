const mongoose = require('mongoose');
const Schema = require('./Schema.js');

// used in login
async function getAllUsers (req, res) {
    const users = await Schema.User.find().exec();
    if (!users) return res.status(204).json({'message': 'No users found.'});
    return res.json(users);
}
module.exports.getAllUsers = getAllUsers;

async function getUserData(req, res) {
    const user = await Schema.User.findOne({email: req.params}).exec();
    if (!user) {
        return res.status(401).json({ "message": `No email matches ID ${req.params.id}.` });
    }
    return res.json(user);
}
module.exports.getUserData = getUserData;

async function getAnnouncements(req, res) {
    try {
        const announcements = await Schema.Announcement.find().exec();
        if (!announcements) {
            return res.status(204).json({'message': 'No announcements found.'})
        }
        return res.json(announcements);
    }
    catch (err){
        if (!res.headersSent) {
            return res.status(500).json({ message: err.message });
        }
    }

}
module.exports.getAnnouncements = getAnnouncements;

async function getUnavailableRooms(req, res) {
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
                    as: 'reservation'
                }

            },
            {
                $addFields: {
                    totalSeats: { $size: '$seats'},
                    reservedSeats: {
                        $size: {
                            $filter: {
                                input: 'reservation',
                                as: 'res',
                                cond: {
                                    $eq: ['$$res.availability', false]
                                }
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    $expr: {
                        $eq: ['$totalSeats', '$reservedSeats']
                    }
                }
            },
            {
                $lookup: {
                    from: 'building',
                    localField: 'buildingId',
                    foreignField: '_id',
                    as: 'building'
                }
            },
            {
                $unwind: 'building'
            },
            {
                $project: {
                    buildingName: '$building.name',
                    labName: '$name'
                }
            }
        ]).exec();
        return res.json(unavailable)
    }
    catch (err){
        if (!res.headersSent) {
            return res.status(500).json({ message: err.message });
            }
    }

}
module.exports.getUnavailableRooms = getUnavailableRooms;

async function getReservationData(req, res) {
    try {
        const reservation = await Schema.Reservation.find({_id: req.params.id}).populate("seatId").exec();
        return res.json(reservation);
    } catch (err) {
        return res.status(500).json({message:err.message});
    }
}
module.exports.getReservationData = getReservationData;


async function getSeatData(req, res) {
    try {
        const seatData = await Schema.Seat.findOne({_id: req.params.id}).exec();
        return res.json(seatData);
    } catch (err) {
        return res.status(500).json({message:err.message});
    }
}
module.exports.getSeatData = getSeatData;

async function getLaboratories(req, res) {
    try {
        const labs = await Schema.Lab.find().exec();
        return res.json(labs);
    } catch (err) {
        return res.status(500).json({message:err.message});
    }
} 
module.exports.getLaboratories = getLaboratories;

async function getBuildings(req, res) {
    try {
        const buildings = await Schema.Building.find().exec();
        return res.json(buildings);
    } catch (err) {
        return res.status(500).json({message:err.message});
    }
}
module.exports.getBuildings = getBuildings;