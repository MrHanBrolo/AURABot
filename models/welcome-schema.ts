import mongoose, {Schema} from 'mongoose'

const reqString = {
    type: String,
    required: true
}

const welcomeSchema = new Schema({
    //Guild ID
    _id: reqString,
    text: reqString,
    channelId: reqString,
})

const name = 'AURABot-Welcome'

// module.exports =
export default mongoose.models[name] || 
    mongoose.model(name, welcomeSchema, name)