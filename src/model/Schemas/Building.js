const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const buildingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    nickname: String,           // Shortcut names for buildings (i.e. Goks)
    floor: {
        type: Number,
        required: true,
        room: {
            type: String,
            required: true,
            seat: Number
        }
    }
});
module.exports = mongoose.models('Building', buildingSchema);