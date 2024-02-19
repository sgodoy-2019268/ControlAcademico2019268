import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import { connectDB } from './mongo.js';
import { validateJwt, errorHandler } from './middlewares/authMiddleware.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//conecta a la DB
connectDB();

//Se configurar middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

//Se definen las rutas
app.use('/api/auth', authRoutes);
app.use('/api/courses', teacherRoutes);

//La ruta de inicio
app.get('/', (req, res) => {
    res.send('Welcome to School Management System');
});

app.use(validateJwt);

app.use(errorHandler);


//Se exportar la aplicación express
export default app;