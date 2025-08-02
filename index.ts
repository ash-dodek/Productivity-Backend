import express from 'express'
import userRoute from './routes/user.route'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRoute)

app.get('/', (req, res) => {
  res.json({ message: 'The backend is up' });
})
mongoose.connect(process.env.MONGO_URL!)
.then(() => {
  app.listen(PORT, () => {
    console.log(`DB connected and Server running on port ${PORT}`);
  })
})
