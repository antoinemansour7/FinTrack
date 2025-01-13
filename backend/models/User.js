const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    plaidAccessToken: { type: String }, // Field to store the Plaid access token
    plaidItemId: { type: String },      // Field to store the Plaid item ID
}, { timestamps: true });

// Pre-save middleware to hash passwords
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema);