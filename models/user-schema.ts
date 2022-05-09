import mongoose, {Schema} from 'mongoose'

const reqString = {
    type: String,
    required: true
}

const userSchema = new Schema({
    guild: reqString,
    userId: reqString,
    messages: String,
    warnings: [{type: Schema.Types.ObjectId, ref: "AURABot-Warns"}],
    warningAmount: {type: Schema.Types.Number, default:0},
    mutes: [{type: Schema.Types.ObjectId, ref: 'AURABot-Mutes'}],
    isBanned: {type: Schema.Types.Boolean},
    isMuted: {type: Schema.Types.Boolean},
})

const name = "AURABot-Users"

// module.exports =
export default mongoose.models[name] || 
    mongoose.model(name, userSchema, name)