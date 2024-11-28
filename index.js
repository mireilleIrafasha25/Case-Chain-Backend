import express from 'express';
import mongoose from 'mongoose';
import router from './Route/index.js';
import errorHandler from './Middleware/errorhandler.js';
import dotenv from 'dotenv';
import documentation from "./Doc/swagger.json" assert { type:"json"};
import swaggerUi from "swagger-ui-express"
dotenv.config();
import cors from "cors"

const corsOptions ={
    allowedHeaders: ["Authorization", "Content-Type" ],
    methods: ["GET", "POST", "PUT", "UPDATE", "DELETE"],
    origin:"*",
}
//time seconds
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout
    socketTimeoutMS: 45000, // 45 seconds timeout
    maxPoolSize: 10, // Maintain up to 10 socket connections
  };
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api_docs",swaggerUi.serve, swaggerUi.setup(documentation))
app.use('/CaseChain',router);
mongoose.connect(`${process.env.db}`,options)
.then(()=>
{
    console.log('connected to db');
})
.catch(err=>
    {
        console.log(err);
    }
)
app.listen(process.env.PORT,()=>
{
    console.log(`server is running on port ${process.env.PORT}`);
})
app.use(errorHandler)