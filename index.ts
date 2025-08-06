import express from 'express'
import userRoute from './routes/user.route'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { ApiResponse } from './utils/ApiResponse';
import appUsageRoute from './routes/appUsage.route'
import webUsageRoute from './routes/webUsage.route'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return ApiResponse(res, {
      success: true,
      message: "The API is up",
      statusCode: 200
    })
})


app.use('/api/user', userRoute)
app.use('/api/usage/app', appUsageRoute)
app.use('/api/usage/web', webUsageRoute)

mongoose.connect(process.env.MONGO_URL!)
.then(() => {
    app.listen(PORT, () => {
        console.log(`DB connected and Server running on port ${PORT}`);
    })
})
