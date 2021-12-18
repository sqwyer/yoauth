require('dotenv').config();
const mongoose = require('mongoose');

const options = {
    mongoUri: process.env.MONGO_URI,
    sessionSecret: 'tacocat',
    background: 'linear-gradient(115deg, rgba(247,141,145,1) 0%, rgba(66,189,210,1) 100%)',
    usernameField: "email",
    userModel: mongoose.model("User", new mongoose.Schema({
        email: String,
        fullname: String,
        age: Number,
        password: String
    }, {
        timestamps: true
    })),
    signupCustomFields: [
        {
            label: "Full Name",
            name: "fullname",
            type: "string",
            placeholder: "John Doe"
        },
        {
            label: "Age",
            name: "age",
            type: "number",
            placeholder: "Age"
        }
    ]
}

module.exports = {options};