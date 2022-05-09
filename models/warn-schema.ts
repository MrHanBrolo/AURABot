import mongoose, {Schema} from 'mongoose'

const reqString = {
    type: String,
    required: true
}


const warnSchema = new Schema({
    guildId: reqString, 
    userId: {type:Schema.Types.String, ref: "AURABot-Users"},
    reason: reqString,
    staffId: reqString,
    caseId: reqString
})


const name = "AURABot-Warns"

// module.exports =
export default mongoose.models[name] || 
    mongoose.model(name, warnSchema, name)