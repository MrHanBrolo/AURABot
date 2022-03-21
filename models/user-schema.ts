import mongoose, {Schema} from 'mongoose'

const reqString = {
    type: String,
    required: true
}

const userSchema = new Schema({
    guild: [{type: Schema.Types.String, ref: 'AURABot-Guilds'}],
    userId: reqString,
    userTag: reqString,
    messages: String,
    warnings: [{type: Schema.Types.ObjectId, ref: 'AURABot-Warns'}],
    mutes: [{type: Schema.Types.ObjectId, ref: 'AURABot-Mutes'}],
    banned: String,
})

const name = 'AURABot-Users'

// module.exports =
export default mongoose.models[name] || 
    mongoose.model(name, userSchema, name)