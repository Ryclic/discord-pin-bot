const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    textValue: { type: String, require: true},
    attachmentUrls: { type: Array, require: false},
    replyTo: { type: Array, require: false},
    dateSent: { type: Date, require: true, default: undefined},
    datePinned: { type: Date, default: Date.now}
})

module.exports = mongoose.model('message', messageSchema);