import express from 'express'
import userRoute from './routes/user.route'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { ApiResponse } from './utils/ApiResponse';

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

mongoose.connect(process.env.MONGO_URL!)
.then(() => {
    app.listen(PORT, () => {
        console.log(`DB connected and Server running on port ${PORT}`);
    })
})
