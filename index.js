import app from './app.js'; // Importamos express

const PORT = process.env.PORT || 3000;

//Se inicia el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
