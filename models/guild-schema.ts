import mongoose, {Schema} from 'mongoose'

const reqString = {
    type: String,
    required: true
}

const guildSchema = new Schema({
    //Guild ID
    _id: reqString,
    guildName: reqString,
    children:[{}]
})

const name = 'AURABot-Guilds'

// module.exports =
export default mongoose.models[name] || 
    mongoose.model(name, guildSchema, name)