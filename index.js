//Primary Goal is to make the server
import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { error } from 'console'

mongoose
  .connect(
    'mongodb+srv://admin:Vinny123@cluster0.3tx315o.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => console.log('Database connected'))
  .catch((err) => console.log(err))

const app = express()

//Mongoose Schema

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
})

//making model out of this schema
const User = mongoose.model('user', userSchema)

//app.use(express.json())

//Here we have publically served files in public folder
app.use(express.static(path.join(path.resolve(), 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
//setting views engine
app.set('view engine', 'ejs')

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies

  if (token) {
    const val = jwt.verify(token, 'iammonkey')
    req.user = await User.findById(val._id)
    next()
  } else {
    res.redirect('/login')
  }
}

app.get('/', isAuthenticated, (req, res) => {
  //   res.status(200).json({
  //     success: true,
  //     products: [],
  //   })
  //   const pathlocation = path.resolve()
  //   console.log(pathlocation)
  //   const finalpath = path.join(pathlocation, './index.html')
  //   res.sendFile(finalpath)

  // res.render('index', { name: 'Vandita' })
  // res.render('index')
  //console.log(req.cookies.token)
  //   const { token } = req.cookies
  //   if (token) {
  //     res.render('logout')
  //   } else {
  //     res.render('login')
  //   }
  res.render('logout', { name: req.user.name })
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.redirect('/register')

    //console.log(user.password)
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const value = jwt.sign({ _id: user._id }, 'iammonkey')
      res.cookie('token', value, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000),
      })
      res.redirect('/')
    } else {
      res.render('login', { email, message: 'Incorrect Password' })
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Internal Server Error')
  }
})
app.get('/logout', (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
  })
  res.redirect('/')
  //   res.render('logout')
})
// app.post('/logout', (req, res) => {
//   res.cookie('token', null, {
//     expires: new Date(Date.now()),
//   })
//   res.redirect('/login')
// })

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  let user = await User.findOne({ email })

  if (user) {
    res.redirect('/login')
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  user = await User.create({
    name,
    email,
    password: hashedPassword,
  })
  res.redirect('/')
})

app.listen(7000, () => {
  console.log('Server has started listening')
})
