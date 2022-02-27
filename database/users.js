const { Schema, model } = require(`mongoose`)
const users = Schema({
    id: Number,
    name: { default: "", type: String, required: true },
});

module.exports = model(`users`, users);