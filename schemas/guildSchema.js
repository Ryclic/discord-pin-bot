const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    serverID: { type: String, require: true},
    votecount: { type: Number, default: 2},
})

module.exports = mongoose.model('guild', guildSchema);