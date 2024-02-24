import PostModel from '../models/Post.js'

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().exec()

		const tags = posts.map(obj => obj.tags).flat()

		res.json(tags)
	} catch (err) {
			res.status(500).json({
			message: 'Can`t get tags',
			error: err
		})
	}
}

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec()

		res.json(posts)
	} catch(err) {
		res.status(500).json({
			message: 'Can`t get states',
			error: err
		})
	}
}


export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      { 
        $inc: { viewsCount: 1 }, 
      },
      {
        returnDocument: 'after',
      }
    ).populate('user').then((doc) => {
		if(!doc) {
			return res.status(404).json({
				message: 'State did not find'
		})}
		
		res.json(doc)
	})
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const remove = async (req, res) => {
	try {
		const postId = req.params.id
		
		PostModel.findOneAndDelete({
			_id: postId,

		}).then(doc => {
			if(!doc) {
				return res.status(404).json({
					message: 'cant find that post'
				})
			}
			res.json({
				success: true
			})
		})
	} catch(err) {
		res.status(500).json({
			message: 'Can`t delete a state',
			error: err
		})
	}
}

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title, 
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.userId
		})

		const post = await doc.save()

		res.json(post)
	} catch (err) {
		res.status(500).json({
			message: 'Can`t create an object',
			error: err
		})
	}
}

export const update = async (req, res) => {
	try {
		const postId = req.params.id 

		await PostModel.updateOne({
			_id: postId
		}, {
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			user: req.userId,
			tags: req.body.tags
		})

		res.json({
			success: true
		})
	} catch(err) {
		res.status(500).json({
			message: 'Can`t update an object',
			error: err
		})
	}
}