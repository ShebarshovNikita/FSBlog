import mongoose from 'mongoose'

const UserModel = new mongoose.Schema({
	fullname: {
		type: String,
		required: true,
	},

	email: {
		type: String,
		required: true,
		unique: true
	},

	passwordHash: {
		type: String,
		required: true
	},

	avatarUrl: String,
}, {
	timestamps: true,
})

export default mongoose.model('User', UserModel)

