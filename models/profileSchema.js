const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    serverID: { type: String, require: true},
    message: { type: String, default: ''},
})

const model = mongoose.model('ProfileModels', profileSchema);

model.exports = model;