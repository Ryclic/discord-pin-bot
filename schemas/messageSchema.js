const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    value: { type: String, require: true},
    messageID: { type: Number, default: 2},
    datePinned: { type: String }
})

module.exports = mongoose.model('message', messageSchema);