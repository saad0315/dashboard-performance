const mongoose = require("mongoose")
const chatSchema = new mongoose.Schema({
    conversationId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"chatRoom"
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the representative user
        },
    text: {
        type: String
    },
    seen: {
        type: Boolean,
        default: false
    },
    files: [{
        type: String // Assuming the file path or reference
    }]
}, 
{
    timestamps : true
}
)
chatSchema.index({ conversationId: 1 }); // Example index on conversationId and sender fields


module.exports = mongoose.model("chats", chatSchema)
