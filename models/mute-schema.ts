import mongoose, {isValidObjectId, Schema, Types} from 'mongoose'

const reqString = {
    type: String,
    required: true
}


const muteSchema = new Schema({
    guildId: {type: Schema.Types.ObjectId, ref: 'AURABot-Guilds'},
    userId: {type: Schema.Types.ObjectId, ref: 'AURABot-Users'},
    reason: reqString,
    time: reqString,
    staffId: reqString
})


const name = 'AURABot-Mutes'

// module.exports =
export default mongoose.models[name] || 
    mongoose.model(name, muteSchema, name)
