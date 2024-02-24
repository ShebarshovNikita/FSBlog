import mongoose from 'mongoose'


const PostModel = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},

	text: {
		type: String,
		required: true,
	},

	tags: {
		type: Array,
		default: []
	},

	imageUrl: {
		type: String,
		required: false
	},

	viewsCount: {
		type: Number,
		default: 0,
	}, 

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
}, {
	timestamps: true,
})

export default mongoose.model('Post', PostModel)

