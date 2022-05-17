import mongoose, {Schema} from 'mongoose'

const reqString = {
    type: String,
    required: true
}


const muteSchema = new Schema({
    guildId: {type: Schema.Types.String, ref: 'AURABot-Guilds'},
    userId: reqString,
    reason: String,
    timeFrom: String,
    timeUntil: String,
    staffId: reqString
})


const name = 'AURABot-Mutes'

// module.exports =
export default mongoose.models[name] || 
    mongoose.model(name, muteSchema, name)
