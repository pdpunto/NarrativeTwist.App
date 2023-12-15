const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Suponiendo que el token viene en el header de autorización como "Bearer [token]"

    if (!token) {
        return res.status(403).send("Se requiere un token para la autenticación");
    }

    try {
        const decoded = jwt.verify(token, process.env.NT_TOKEN);
        req.user = decoded; // Agrega la información decodificada a la solicitud
        next(); // pasa el control al siguiente middleware
    } catch (err) {
        res.status(401).send("Token inválido");
    }
};

module.exports = verifyToken;
