import mongoose, { Schema } from 'mongoose'

const logSchema = new Schema({
    guildId: { type: Schema.Types.String, ref: 'AURABot-Guilds' },
    logs: [{
        logName: String,
        channelId: String
    }]
})


const name = 'AURABot-LogSettings'

// module.exports =
export default mongoose.models[name] ||
    mongoose.model(name, logSchema, name)
