const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
    type : String
});
module.exports = mongoose.models('Announcement', announcementSchemaSchema);

