import { User } from '../models/user.js'

export const getallUsers = async (req, res) => {
  const users = await User.find({})
  res.json({
    success: true,
    users,
  })
}

export const createUser = async (req, res) => {
  const { name, email, password } = req.body
  await User.create({
    name,
    email,
    password,
  })
  res.status(201).json({
    success: true,
    message: 'Registered successfully',
  })
}

export const getUserByQuery = async (req, res) => {
  const { id } = req.query
  const user = await User.findById(id)

  res.json({
    success: true,
    user,
  })
}

export const getUserByParams = async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)

  res.json({
    success: true,
    user,
  })
}
export const updateUser = async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)

  res.json({
    success: true,
    message: 'User updated',
  })
}
export const deleteUser = async (req, res) => {
  const { id } = req.params
  const user = await User.findByIdAndDelete(id)

  res.json({
    success: true,
    message: 'Deleted successfully',
    user,
  })
}
