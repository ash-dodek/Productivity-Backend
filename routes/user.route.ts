import express from "express"
import {LoginUser, LogoutUser, registerUser} from '../controllers/User.controller'
import { authorizeUser } from '../middlewares/auth';

const router = express.Router()

router.get('/', (req, res) => {
    res.json("works")
})

router.post('/register', registerUser)

router.post('/login', LoginUser)

router.get('/logout', LogoutUser)
export default router