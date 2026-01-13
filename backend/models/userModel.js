const { db1 } = require("../config/db");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { type } = require("os");

userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Enter Your Name"],
        minLength: [2, "Name should be Greater than 2 Character "],
    },
    userEmail: {
        type: String,
        unique: true,
        required: [true, "Enter Your Email Address"],
    },
    userPassword: {
        type: String,
        minLength: [8, "Password should be Greater than 8 Character "],
        select: false,
    },
    role: {
        type: String,
        enum: ["superAdmin", "admin", "manager", "dataEntry", "user", "ppc", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"],
        default: "user",
    },
    designation: {
        type: String,
        enum: ["admin", "manager", "dataEntry", "user", "ppc", "frontSell", "Upsell", "ProjectManager"],
        default: "user",
    },
    teams: [{
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true
        },
        role: {
            type: String,
            enum: ["member", "manager"],
            default: "member"
        },
        permissions: {
            canViewLeads: { type: Boolean, default: true },
            canAssignLeads: { type: Boolean, default: false },
            canEditLeads: { type: Boolean, default: true },
            canDeleteLeads: { type: Boolean, default: false }
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    profileImg: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    verified: {
        type: Boolean,
        default: true,
    },
    isRemoteAccessAllowed: {
        type: Boolean,
        default: false,
    },
    FTLToken: {
        type: String,
    },
    resetPasswordToken: String,
    status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active',
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("userPassword")) {
        next();
    }
    this.userPassword = await bcrypt.hash(this.userPassword, 10);
});
userSchema.methods.isPasswordMatch = async function (enterdPassword) {
    return await bcrypt.compare(enterdPassword, this.userPassword);
};
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

userSchema.methods.passwordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.FTLToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    return resetToken;
};

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}


const User = db1.model("User", userSchema);


module.exports = User;