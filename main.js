const Discord = require('discord.js');
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Successfully connected to the database!');
})
.catch((err) => {
    console.log(err);
})