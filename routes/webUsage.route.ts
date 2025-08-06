import express from "express"
import { authorizeUser } from '../middlewares/auth'
import {updateWebsiteUsage} from '../controllers/webUsage.controller'

const router = express.Router()

router.post('/update', authorizeUser, updateWebsiteUsage)

export default router