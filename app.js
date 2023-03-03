import express from 'express';
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import 'dotenv/config'
import cors from 'cors'
import mongoose from 'mongoose'
import {ServerApiVersion} from 'mongodb'
import errorHandler from './public/javascripts/error'

const port = process.env.PORT || 5000
const app = express();
const api = process.env.API_URL || 'http://127.0.0.1:5173'
const api2 = process.env.API_URL2 || 'http://127.0.0.1:3000'
//handle cors policy
app.use(cors({
    origin: [api, api2],
    method: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
}))
app.options('*', cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

(async () => {
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'ecommerce',
            serverApi: ServerApiVersion.v1
        })
        console.log('MongoDB connected');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
})().catch(console.dir)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app;
