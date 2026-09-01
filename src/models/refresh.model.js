const mongoose = require("mongoose")

const refreshSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: "user"
    },
    token: {
        type: String,
        required: true,

    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    },
});


const RefreshModel = mongoose.model("refreshToken", refreshSchema);

module.exports = RefreshModel;
