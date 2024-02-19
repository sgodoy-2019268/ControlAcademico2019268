import Student from '../models/studentModel.js';
import Course from '../models/courseModel.js';

export const assignCourse = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).populate('courses');
        if (student.courses.length >= 3) {
            return res.status(400).json({ message: 'Ya está asignado al máximo de cursos permitidos.' });
        }

        if (student.courses.some(course => course._id.toString() === req.params.courseId)) {
            return res.status(400).json({ message: 'Ya está asignado a este curso.' });
        }

        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Curso no encontrado.' });
        }

        student.courses.push(course);
        await student.save();

        res.status(200).json({ message: 'Curso asignado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al asignar el curso.' });
    }
};

export const viewCourses = async (req, res) => {
    try {
        const courses = await Course.find();

        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los cursos.' });
    }
};

export const editProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);
        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado.' });
        }

        student.username = req.body.username || student.username;
        student.email = req.body.email || student.email;

        await student.save();

        res.status(200).json({ message: 'Perfil actualizado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el perfil.' });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.user.id);

        res.status(200).json({ message: 'Perfil eliminado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el perfil.' });
    }
};
