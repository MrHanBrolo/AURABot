import mongoose, { Schema } from 'mongoose'

const guildSchema = new Schema({
    guildId: { type: Schema.Types.String },
    guildName: { type: Schema.Types.String },
    logSettings: {type: Schema.Types.ObjectId, ref: "AURABot-LogSettings"},
    mutedRoleId: {type: Schema.Types.String},
    bansIssued: {type: Schema.Types.Number, default: 0},
    casesMade: {type: Schema.Types.Number, default: 0}
})

const name = 'AURABot-Guilds'

// module.exports =
export default mongoose.models[name] ||
    mongoose.model(name, guildSchema, name)

console.log(mongoose.connection.readyState)
