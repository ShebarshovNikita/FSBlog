import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

import { validationResult } from 'express-validator'

import   UserModel   from '../models/User.js'

export const register = async (req, res) => {
	try {
		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		const doc = new UserModel({
			email: req.body.email,
			avatarUrl: req.body.avatarUrl,
			fullname: req.body.fullname,
			passwordHash: hash,
		})

		const user = await doc.save()

		const token = jwt.sign({
			_id: user._id
		}, 'secret123', { expiresIn: '30d' })
		
		const { passwordHash , ...userData} = user._doc

		res.json({
			...userData,
			token
		})
	} catch(err) {
		console.log(err)
		res.status(500).json({
			message: 'Cant register',
			error: err
		})
	}
}

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email })

		if (!user) {
			return res.status(404).json({
				message: 'User is not found',
			})
		}

		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

		if (!isValidPass) {
			return res.status(400).json({
				message: 'Password/Login is not correct',
			})
		}

		const token = jwt.sign({
			_id: user._id 
		}, 'secret123', { expiresIn: '30d' })

		const { passwordHash , ...userData} = user._doc

		res.json({
			...userData,
			token,
		})

	} catch(err) {
		return res.status(404).json({
				message: 'Autorization did fall',
		})
	}
}

export const getMe = async (req, res) =>  {
	try {
		const user = await UserModel.findById(req.userId)

		if (!user) {
			return res.status(404).json({
				message: 'User not found'
			})
		}

		const { passwordHash , ...userData} = user._doc

		res.json(
			userData
		)

	} catch(err) {
		res.status(500).json({
			message: 'Bad request',
			error: err
		})
	}
}