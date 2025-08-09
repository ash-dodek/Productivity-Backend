import express from "express"
import { authorizeUser } from '../middlewares/auth'
import {getWebsiteUsageByURL, updateWebsiteUsage} from '../controllers/webUsage.controller'

const router = express.Router()

router.post('/update', authorizeUser, updateWebsiteUsage)

router.get('/get', authorizeUser, getWebsiteUsageByURL) 

export default router