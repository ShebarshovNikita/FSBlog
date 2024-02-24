import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import fs from 'fs'

import cors from 'cors'

import { registerValidation, loginValidation, postCreateValidation } from './validation.js'

import {register, login, getMe} from './controllers/UserController.js'
import {create, getAll, getOne, remove, update, getLastTags} from './controllers/PostController.js'

import handleValidationErrors from "./utils/handleValidationErrors.js"
import checkAuth from './utils/checkAuth.js'

mongoose
	.connect('mongodb+srv://admin:1111@cluster0.bly8lpu.mongodb.net/blog?retryWrites=true&w=majority')
	.then(() => {
		console.log('DBok')
		})
	.catch((err) => console.log('DB error', err))

const app = express()

app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).send();
});

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage })



app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors, login)
app.post('/auth/register', registerValidation, handleValidationErrors, register)
app.get('/auth/me', checkAuth, getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

app.get('/tags', getLastTags)

app.get('/posts', getAll) 
app.get('/posts/:id', getOne)
app.get('/posts/tags', getLastTags)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, create)
app.delete('/posts/:id', checkAuth, remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, update)

app.listen(4444, (err) => {
	if (err) {
		return console.log(err)
	}

	console.log("Server OK")
})

