import express from 'express'
import {
  createUser,
  getUserByParams,
  getUserByQuery,
  getallUsers,
  updateUser,
  deleteUser,
} from '../controllers/user.js'

const router = express.Router()

router.get('/users/all', getallUsers)
router.post('/users/register', createUser)
//Query

router.get('/user', getUserByQuery)

//Param
router.get('/getuser/:id', getUserByParams)
router.put('/getuser/:id', updateUser)
router.delete('/getuser/:id', deleteUser)

export default router
