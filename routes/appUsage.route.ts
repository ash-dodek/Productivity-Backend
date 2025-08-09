import express from "express"
import { authorizeUser } from '../middlewares/auth'
import { addUsageOfApp, getAppUsageByName } from '../controllers/appUsage.controller';

const router = express.Router()

router.post('/update', authorizeUser, addUsageOfApp)

router.get('/get', authorizeUser, getAppUsageByName) 
// can get usage with the help of passing query as appname or app id

export default router