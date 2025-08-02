import express from "express"
import {registerUser} from '../controllers/User.controller'

const router = express.Router()

router.get('/', (req, res) => {
    res.json("works")
})

router.post('/register', registerUser)

export default router