import mongoose, { Schema } from 'mongoose'

const guildSchema = new Schema({
    guildId: { type: Schema.Types.String },
    guildName: { type: Schema.Types.String },
})

const name = 'AURABot-Guilds'

// module.exports =
export default mongoose.models[name] ||
    mongoose.model(name, guildSchema, name)

console.log(mongoose.connection.readyState)
