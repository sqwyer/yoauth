if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
    email: String,
    fullName: String,
    password: String
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = {User};