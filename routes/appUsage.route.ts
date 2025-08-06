import express from "express"
import { authorizeUser } from '../middlewares/auth'
import { addUsageOfApp } from '../controllers/appUsage.controller';

const router = express.Router()

router.post('/update', authorizeUser, addUsageOfApp)

export default router