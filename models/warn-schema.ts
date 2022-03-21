import mongoose, {isValidObjectId, Schema, Types} from 'mongoose'

const reqString = {
    type: String,
    required: true
}


const warnSchema = new Schema({
    guildId: {type: Schema.Types.String, ref: 'AURABot-Guilds'}, 
    userId: {type: Schema.Types.String, ref: 'AURABot-Users'},
    reason: reqString,
    staffId: reqString,
})


const name = 'AURABot-Warns'

// module.exports =
export default mongoose.models[name] || 
    mongoose.model(name, warnSchema, name)