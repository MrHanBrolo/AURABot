import mongoose, {Schema, Types} from 'mongoose'

const reqString = {
    type: String,
    required: true
}

const welcomeSchema = new Schema({
    guildId: {type: Schema.Types.ObjectId, ref: 'AURABot-Guilds'},
    text: reqString,
    channelId: reqString
})


const name = 'AURABot-WelcomeSettings'

// module.exports =
export default mongoose.models[name] || 
    mongoose.model(name, welcomeSchema, name)