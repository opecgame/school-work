const mongoose = require(`mongoose`)
mongoose.connect(`${config.mongoconnect}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log(`[Logs] Client Database has connected!`)).catch((err) => console.log(err))