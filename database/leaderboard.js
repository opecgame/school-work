const { Schema, model } = require(`mongoose`)
const leaders = Schema({
    id : { default: "0", type: String, required: true },
    games: { default: [], type: Array, required: true },
});

module.exports = model(`leaderboards`, leaders);