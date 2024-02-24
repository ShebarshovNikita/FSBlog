import { body } from 'express-validator'

export const loginValidation = [
	body('email', 'Incorrect email').isEmail(),
	body('password', 'Min length is 5').isLength({min: 5}),
]

export const registerValidation = [
	body('email', 'Incorrect email').isEmail(),
	body('password', 'Min length is 5').isLength({min: 5}),
	body('fullName', 'Min length is 3').isLength({min: 3}),
	body('avatarUrl', 'Incorrect URL').optional().isURL()
]

export const postCreateValidation = [
	body('title', 'Enter the title name').isLength({ min: 3 }).isString(),
	body('text', 'Write the text').isLength({ min: 10 }).isString(),
	body('tags', 'Incorrect format of tags').optional().isString(),
	body('imageUrl', 'Incorrect URL').optional().isString() 
]