import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Teacher from './models/teacherModel.js'; //Se importa el modelo de maestro

export const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        //Conexion
        mongoose.connection.on('error', () => {
            console.log('MongoDB | could not be connect to mongodb');
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | try connecting');
        });
        mongoose.connection.on('connected', () => {
            console.log('MongoDB | connected to mongodb');
        });
        mongoose.connection.once('open', async () => {
            console.log('MongoDB | connected to database');

            //Se verifica si hay algun maestro en la DB
            const existingTeacher = await Teacher.findOne();

            //Se crea un maestro por defecto (si no hay ninguno ya creado)
            if (!existingTeacher) {
                const hashedPassword = await bcrypt.hash('admin123', 10); //Se encriptar la contraseña
                const defaultTeacher = new Teacher({
                    name: 'defaultTeacher',
                    surname: 'default',
                    username: 'admin',
                    password: hashedPassword, //Se asigna la contraseña encriptada
                    email: 'admin@example.com',
                    role: 'TEACHER',
                    versionKey: false
                });
                await defaultTeacher.save();
                console.log('Default teacher created:', defaultTeacher);
            }
        });
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | reconnected to mongodb');
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | disconnected');
        });

        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50
        });

        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Database connection failed', err);
    }
};

