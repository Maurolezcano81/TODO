import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
dotenv.config();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// IMPORT DB
import { connection } from './config/db.js';

connection.connect((error) =>{
    if(error){
        console.error(error);
        return;
    }

    console.log("Conectado a la base de datos: ",process.env.db_name);
});


// IMPORT ROUTERS 
import UserRoute from './routes/UserRoutes.js';

// ROUTES
app.use('/api', UserRoute);


// RUN SERVER
app.listen( process.env.sv_port || 3000, ()=>{
    console.log('Server corriendo en puerto: ', process.env.sv_port);
});