const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken');
const moment = require('moment');
require('dotenv').config();

const app = express();
const PORT = 3002;

app.use(express.json());

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  }
  
  app.use(cors(corsOptions));

// Configuración de conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Configuración del transporte de Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

// Verificar la conexión del transporte de Nodemailer
transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Servidor listo para enviar correos");
    }
});

// Función para generar un código de usuario de 6 dígitos
function generateUserCode() {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return code;
}

///////////////////////// Rutas  /////////////////////////////
app.get('/', (req, res) => {
    res.send('Bienvenido al servidor de NarrativeTwist');
});

app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;
    const userCode = generateUserCode();

    if (!username || !password || !email) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    const userCheckQuery = 'SELECT * FROM users WHERE Username = ? OR Email = ?';
    const [users] = await db.promise().query(userCheckQuery, [username, email]);
    if (users.length > 0) {
        return res.status(409).send('El nombre de usuario o el correo electrónico ya está en uso');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Asegúrate de que la consulta SQL incluya el campo UserCode
    const insertQuery = 'INSERT INTO users (Username, Password, Email, VerificationToken, UserCode) VALUES (?, ?, ?, ?, ?)';
    try {
        // Incluye userCode en los parámetros que pasas a la consulta SQL
        await db.promise().query(insertQuery, [username, hashedPassword, email, verificationToken, userCode]);

        const emailBody = `
        <!DOCTYPE html>
        <html>
        <head>
        <style>
        .email-container {
            width: 100%;
            font-family: Arial, sans-serif;
            color: #2a4857; /* Color de texto azul oscuro de tu app */
            text-align: center;
            background-color: #f4f4f4;
        }
        .button {
            padding: 10px 20px;
            color: #ffffff;
            background-color: #eeac65; /* Color naranja de tu app */
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
        }
        .button:hover {
            background-color: #e67e22; /* Un tono más oscuro para el hover */
        }
        img {
            max-width: 200px; /* Ajusta esto según el tamaño deseado para el logo */
        }
        </style>
        </head>
        <body>
        <div class="email-container">
        <img src="http://narrativetwist.app/images/logo_meil.png" alt="NarrativeTwist Logo"/>
        <h1>¡Bienvenido a NarrativeTwist!</h1>
        <p>Estás a solo un paso de comenzar tu aventura. Por favor, verifica tu cuenta para activarla:</p>
        <a href="https://narrativetwist.app/verify/${verificationToken}" class="button">Verificar Cuenta</a>
        </div>
        </body>
        </html>
        
        `;
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Verificación de cuenta',
            html: emailBody
        };

        await transporter.sendMail(mailOptions);

        res.status(201).send('Usuario registrado exitosamente. Por favor, verifica tu email.');
    } catch (err) {
        console.error('Error al registrar el usuario:', err);
        res.status(500).send('Error al registrar el usuario');
    }
});

app.get('/api/verify-account/:token', async (req, res) => {
    const { token } = req.params;

    try {
        // Buscar el usuario con el token de verificación proporcionado
        const userQuery = 'SELECT * FROM users WHERE VerificationToken = ?';
        const [users] = await db.promise().query(userQuery, [token]);

        if (users.length === 0) {
            return res.status(404).send('Token de verificación no válido o usuario ya verificado');
        }

        // Actualizar el estado de verificación del usuario
        const updateQuery = 'UPDATE users SET IsVerified = 1, VerificationToken = NULL WHERE UserID = ?';
        await db.promise().query(updateQuery, [users[0].UserID]);

        res.status(200).send('Cuenta verificada exitosamente');
    } catch (err) {
        console.error('Error al verificar la cuenta:', err);
        res.status(500).send('Error al verificar la cuenta');
    }
});

app.get('/api/check-verification/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params;

    try {
        const query = 'SELECT IsVerified FROM users WHERE UserID = ?';
        const [result] = await db.promise().query(query, [userId]);
        if (result.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        const isVerified = result[0].IsVerified;
        res.status(200).json({ isVerified: isVerified === 1 });
    } catch (err) {
        console.error('Error al verificar el estado del usuario:', err);
        res.status(500).send('Error interno del servidor');
    }
});

app.post('/api/resend-verification', async (req, res) => {
    const { userId } = req.body;

    // Buscar el usuario no verificado por userId para obtener su email y token de verificación
    const userQuery = 'SELECT Email, VerificationToken FROM users WHERE UserID = ? AND IsVerified = 0';
    try {
        const [users] = await db.promise().query(userQuery, [userId]);
        if (users.length === 0) {
            return res.status(404).send('Usuario no encontrado o ya está verificado.');
        }

        const user = users[0];

        // Aquí asegúrate de que el VerificationToken exista
        let verificationToken = user.VerificationToken;
        if (!verificationToken) {
            // Si no hay token de verificación, genera uno nuevo
            verificationToken = crypto.randomBytes(32).toString('hex');
            const updateTokenQuery = 'UPDATE users SET VerificationToken = ? WHERE UserID = ?';
            await db.promise().query(updateTokenQuery, [verificationToken, userId]);
        }

        // Configura el cuerpo del email de verificación
        const emailBody = `
        <!DOCTYPE html>
        <html>
        <head>
        <style>
        .email-container {
            width: 100%;
            font-family: Arial, sans-serif;
            color: #2a4857; /* Color de texto azul oscuro de tu app */
            text-align: center;
            background-color: #f4f4f4;
        }
        .button {
            padding: 10px 20px;
            color: #ffffff;
            background-color: #eeac65; /* Color naranja de tu app */
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
        }
        .button:hover {
            background-color: #e67e22; /* Un tono más oscuro para el hover */
        }
        img {
            max-width: 200px; /* Ajusta esto según el tamaño deseado para el logo */
        }
        </style>
        </head>
        <body>
        <div class="email-container">
        <img src="https://narrativetwist.app/images/logo_meil.png" alt="NarrativeTwist Logo"/>
        <h1>¡Bienvenido a NarrativeTwist!</h1>
        <p>Estás a solo un paso de comenzar tu aventura. Por favor, verifica tu cuenta para activarla:</p>
        <a href="https://narrativetwist.app/verify/${verificationToken}" class="button">Verificar Cuenta</a>
        </div>
        </body>
        </html>
        
        `;

        // Configura las opciones del email
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Verificación de cuenta',
            html: emailBody
        };

        // Envía el email
        await transporter.sendMail(mailOptions);

        res.status(200).send('Email de verificación reenviado exitosamente.');
    } catch (error) {
        console.error('Error al reenviar email de verificación:', error);
        res.status(500).send('Error interno del servidor al intentar reenviar el email de verificación.');
    }
});


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
        return res.status(400).send('Email y contraseña son obligatorios');
    }

    try {
        // Verificar las credenciales del usuario
        const userQuery = 'SELECT * FROM users WHERE Email = ?';
        const [users] = await db.promise().query(userQuery, [email]);
        if (users.length === 0) {
            return res.status(401).send('Credenciales incorrectas');
        }

        const user = users[0];

        // Verificar la contraseña con la almacenada en la base de datos
        const match = await bcrypt.compare(password, user.Password);
        if (!match) {
            return res.status(401).send('Credenciales incorrectas');
        }

        // Generar un token JWT
        const token = jwt.sign(
            { userId: user.UserID, username: user.Username },
            process.env.NT_TOKEN,
            { expiresIn: '1h' }
        );

        // Enviar el token en la respuesta
        res.status(200).json({ message: 'Inicio de sesión exitoso', token: token });
    } catch (err) {
        console.error('Error en el proceso de inicio de sesión:', err);
        res.status(500).send('Error al procesar la solicitud de inicio de sesión');
    }
});

// Para el endpoint /create-room
function generateRoomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Es el endpoint que crea la sala
app.post('/api/create-room', verifyToken, async (req, res) => {
    const { maxInteractions, isPublic, keywords } = req.body;
    const userId = req.user.userId;
    const roomCode = generateRoomCode(6);

    // Verificar si el usuario ha alcanzado el límite total de salas creadas
    const checkTotalRoomsQuery = 'SELECT COUNT(*) as TotalRooms FROM user_gamerooms WHERE UserID = ? AND IsCreator = 1';
    
    try {
        const [totalRoomsResult] = await db.promise().query(checkTotalRoomsQuery, [userId]);
        
        if (totalRoomsResult[0].TotalRooms >= 4) {
            return res.status(400).send('Has alcanzado el límite total de salas que puedes crear.');
        }

        // Definir la consulta para insertar la nueva sala
        const insertRoomQuery = 'INSERT INTO gamerooms (RoomCode, MaxInteractions, IsPublic, Keywords) VALUES (?, ?, ?, ?)';
        const [roomResult] = await db.promise().query(insertRoomQuery, [roomCode, maxInteractions, isPublic ? 1 : 0, keywords]);
        const roomID = roomResult.insertId;

        // Registrar al usuario como creador de la sala
        const insertUserRoomQuery = 'INSERT INTO user_gamerooms (UserID, RoomID, IsCreator) VALUES (?, ?, 1)';
        await db.promise().query(insertUserRoomQuery, [userId, roomID]);

        res.status(201).json({ roomCode });
    } catch (err) {
        console.error('Error al crear la sala:', err);
        res.status(500).send('Error al crear la sala');
    }
});

// Nuevo endpoint para obtener el total de salas creadas por el usuario
app.get('/api/user-total-rooms', verifyToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const [result] = await db.promise().query(
            'SELECT COUNT(*) as TotalRooms FROM user_gamerooms WHERE UserID = ? AND IsCreator = 1',
            [userId]
        );

        res.json({ totalRooms: result[0].TotalRooms });
    } catch (err) {
        console.error('Error al obtener el total de salas creadas:', err);
        res.status(500).send('Error interno del servidor');
    }
});

//contador de cuentas creadas por el usuario a la
app.get('/api/user-rooms-created-count', verifyToken, async (req, res) => {
    const userId = req.user.userId; // Asegúrate de que estás obteniendo correctamente el ID del usuario autenticado
    const weekStart = moment().startOf('isoWeek').format('YYYY-MM-DD'); // Usa moment.js para obtener el inicio de la semana

    try {
        const [result] = await db.promise().query(
            'SELECT RoomsCreated FROM user_room_creation WHERE UserID = ? AND CreationWeek = ?',
            [userId, weekStart]
        );

        // Si no hay un registro para esta semana, significa que no se han creado salas
        if (result.length === 0) {
            return res.json({ roomsCreatedThisWeek: 0 });
        }

        // Si hay un registro, devolver el número de salas creadas
        res.json({ roomsCreatedThisWeek: result[0].RoomsCreated });
    } catch (err) {
        console.error('Error al obtener el conteo de salas creadas:', err);
        res.status(500).send('Error interno del servidor');
    }
});

app.delete('/api/delete-room/:roomCode', verifyToken, async (req, res) => {
    const { roomCode } = req.params;
    const userId = req.user.userId;

    console.log(`Intentando eliminar la sala con código: ${roomCode} por el usuario: ${userId}`);

    try {
        // Comprobar si el usuario es el creador de la sala
        const checkCreatorQuery = `
            SELECT g.RoomID 
            FROM gamerooms g
            JOIN user_gamerooms ug ON g.RoomID = ug.RoomID
            WHERE g.RoomID = ? AND ug.UserID = ? AND ug.IsCreator = 1`;
        const [creatorCheck] = await db.promise().query(checkCreatorQuery, [roomCode, userId]);

        if (creatorCheck.length === 0) {
            console.log('El usuario no es el creador de la sala o la sala no existe');
            return res.status(403).send('No tienes permiso para eliminar esta sala');
        }

        const roomId = creatorCheck[0].RoomID;
        console.log(`Sala encontrada con ID: ${roomId}, procediendo a eliminar`);

        // Eliminar la sala y todas sus historias asociadas
        await db.promise().query('DELETE FROM stories WHERE RoomID = ?', [roomId]);
        console.log('Historias eliminadas');

        await db.promise().query('DELETE FROM finalized_stories WHERE RoomID = ?', [roomId]);
        console.log('Historias finalizadas eliminadas');

        await db.promise().query('DELETE FROM user_gamerooms WHERE RoomID = ?', [roomId]);
        console.log('Relaciones de usuario con la sala eliminadas');

        await db.promise().query('DELETE FROM gamerooms WHERE RoomID = ?', [roomId]);
        console.log('Sala eliminada');

        res.status(200).send('Sala eliminada exitosamente');
    } catch (err) {
        console.error('Error al eliminar la sala:', err);
        res.status(500).send('Error interno del servidor');
    }
});


app.delete('/api/remove-room-from-list/:roomCode', verifyToken, async (req, res) => {
    const { roomCode } = req.params;
    const userId = req.user.userId;

    try {
        // Buscar el RoomID basado en el RoomCode proporcionado
        const roomQuery = 'SELECT RoomID FROM gamerooms WHERE RoomCode = ?';
        const [rooms] = await db.promise().query(roomQuery, [roomCode]);
        if (rooms.length === 0) {
            return res.status(404).send('Sala no encontrada');
        }
        const roomId = rooms[0].RoomID;

        // Eliminar la relación del usuario con la sala si no es el creador
        const deleteQuery = 'DELETE FROM user_gamerooms WHERE UserID = ? AND RoomID = ? AND IsCreator = 0';
        await db.promise().query(deleteQuery, [userId, roomId]);

        res.status(200).send('Sala eliminada de tu lista exitosamente');
    } catch (err) {
        console.error('Error al eliminar la sala de la lista:', err);
        res.status(500).send('Error interno del servidor');
    }
});

app.put('/api/rename-room/:roomCode', verifyToken, async (req, res) => {
    const { roomCode } = req.params;
    const { customRoomName } = req.body;
    const userId = req.user.userId;

    try {
        // Encuentra el RoomID basado en el RoomCode
        const roomQuery = 'SELECT RoomID FROM gamerooms WHERE RoomCode = ?';
        const [room] = await db.promise().query(roomQuery, [roomCode]);
        if (room.length === 0) {
            return res.status(404).send('Sala no encontrada');
        }
        const roomId = room[0].RoomID;

        // Verificar si el usuario es parte de la sala
        const userRoomQuery = 'SELECT * FROM user_gamerooms WHERE UserID = ? AND RoomID = ?';
        const [userRoom] = await db.promise().query(userRoomQuery, [userId, roomId]);
        if (userRoom.length === 0) {
            return res.status(403).send('No tienes permiso para renombrar esta sala');
        }

        // Actualiza el nombre personalizado en user_gamerooms
        const updateQuery = 'UPDATE user_gamerooms SET CustomRoomName = ? WHERE UserID = ? AND RoomID = ?';
        await db.promise().query(updateQuery, [customRoomName, userId, roomId]);

        res.status(200).send('Nombre de la sala actualizado exitosamente');
    } catch (err) {
        console.error('Error al renombrar la sala:', err);
        res.status(500).send('Error interno del servidor');
    }
});



// Es el endpoint para unirse a sala
app.post('/api/join-room', verifyToken, async (req, res) => {
    const { roomCode } = req.body;
    const userId = req.user.userId; // Extraer userId del token JWT

    if (!roomCode) {
        return res.status(400).send('El código de la sala es obligatorio');
    }

    try {
        const roomQuery = 'SELECT RoomID FROM gamerooms WHERE RoomCode = ?';
        const [rooms] = await db.promise().query(roomQuery, [roomCode]);
        
        if (rooms.length > 0) {
            const room = rooms[0];

            // Verificar si el usuario es el creador de la sala
            const creatorQuery = 'SELECT * FROM user_gamerooms WHERE UserID = ? AND RoomID = ?';
            const [creator] = await db.promise().query(creatorQuery, [userId, room.RoomID]);

            // Si el usuario no es el creador, agregarlo como participante
            if (creator.length === 0) {
                const insertUserRoomQuery = 'INSERT INTO user_gamerooms (UserID, RoomID, IsCreator) VALUES (?, ?, 0)';
                await db.promise().query(insertUserRoomQuery, [userId, room.RoomID]);
            }

            // Proporcionar detalles de la sala y proceder a la sala
            res.status(200).json({ message: 'Unido a la sala exitosamente', roomDetails: room });
        } else {
            res.status(404).send('Sala no encontrada');
        }
    } catch (err) {
        console.error('Error al unirse a la sala:', err);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.get('/api/public-rooms', async (req, res) => {
    try {
        const query = 'SELECT RoomID, RoomCode, Keywords, MaxInteractions FROM gamerooms WHERE IsPublic = 1';
        const [rooms] = await db.promise().query(query);
        res.json(rooms);
    } catch (error) {
        console.error('Error al obtener salas públicas:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Nuevo endpoint para obtener salas del usuario
app.get('/api/user-rooms/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params;

    const query = `
        SELECT g.*, ug.IsCreator, ug.CustomRoomName 
        FROM gamerooms g 
        JOIN user_gamerooms ug ON g.RoomID = ug.RoomID 
        WHERE ug.UserID = ?;
    `;

    try {
        const [rooms] = await db.promise().query(query, [userId]);
        res.status(200).json(rooms);
    } catch (err) {
        console.error('Error al obtener las salas del usuario:', err);
        res.status(500).send('Error al procesar la solicitud');
    }
});


// Endpoint para añadir contribuciones a una sala específica
app.post('/api/add-contribution', verifyToken, async (req, res) => {
    const { roomCode, contributionText } = req.body;
    const userId = req.user.userId; // Extraer userId del token JWT

    if (!roomCode || !contributionText) {
        return res.status(400).send('Código de sala y texto de la contribución son obligatorios');
    }

    // Buscar el RoomID usando el RoomCode
    const roomQuery = 'SELECT RoomID, MaxInteractions, IsFinalized FROM gamerooms WHERE RoomCode = ?';
    const [rooms] = await db.promise().query(roomQuery, [roomCode]);
    if (rooms.length === 0) {
        return res.status(404).send('Sala no encontrada');
    }

    const room = rooms[0];
    if (room.IsFinalized) {
        return res.status(400).send('La sala ya ha finalizado');
    }

    // Insertar la contribución en la base de datos incluyendo el UserID
    const insertQuery = 'INSERT INTO stories (RoomID, StoryText, UserID) VALUES (?, ?, ?)';
    await db.promise().query(insertQuery, [room.RoomID, contributionText, userId]);

    // Contar las contribuciones actuales
    const countQuery = 'SELECT COUNT(*) AS count FROM stories WHERE RoomID = ?';
    const [countResult] = await db.promise().query(countQuery, [room.RoomID]);
    const currentCount = countResult[0].count;

    if (currentCount >= room.MaxInteractions) {
        // Actualizar el estado de la sala a finalizado
        const finalizeQuery = 'UPDATE gamerooms SET IsFinalized = 1 WHERE RoomID = ?';
        await db.promise().query(finalizeQuery, [room.RoomID]);
    }

    res.status(201).send('Contribución añadida exitosamente');
});


// Endpoint para obtener los nombres de los usuarios que han contribuido a una sala
app.get('/api/room-contributors/:roomCode', verifyToken, async (req, res) => {
    const { roomCode } = req.params;

    try {
        const roomQuery = 'SELECT RoomID FROM gamerooms WHERE RoomCode = ?';
        const [rooms] = await db.promise().query(roomQuery, [roomCode]);
        if (rooms.length === 0) {
            return res.status(404).send('Sala no encontrada');
        }
        const roomId = rooms[0].RoomID;

        const contributorsQuery = `
            SELECT DISTINCT u.UserID, u.DisplayName, u.UserCode
            FROM stories s
            JOIN users u ON s.UserID = u.UserID
            WHERE s.RoomID = ?;
        `;
        const [contributors] = await db.promise().query(contributorsQuery, [roomId]);

        const formattedContributors = contributors.map(c => c.DisplayName || `Usuario#${c.UserCode}`);

        res.status(200).json({ contributors: formattedContributors });
    } catch (err) {
        console.error('Error al obtener los contribuyentes de la sala:', err);
        res.status(500).send('Error interno del servidor');
    }
});

// Endpoint para obtener la historia actual de una sala y las interacciones restantes
app.get('/api/get-story/:roomCode', async (req, res) => {
    const { roomCode } = req.params;

    try {
        // Obtener información de la sala, incluyendo el número máximo de interacciones
        const roomQuery = 'SELECT RoomID, IsFinalized, MaxInteractions FROM gamerooms WHERE RoomCode = ?';
        const [rooms] = await db.promise().query(roomQuery, [roomCode]);
        if (rooms.length === 0) {
            return res.status(404).send('Sala no encontrada');
        }
        const room = rooms[0];

        // Obtener el conteo de contribuciones actuales
        const countQuery = 'SELECT COUNT(*) AS ContributionCount FROM stories WHERE RoomID = ?';
        const [countResult] = await db.promise().query(countQuery, [room.RoomID]);
        const currentContributions = countResult[0].ContributionCount;

        // Calcular las interacciones restantes
        const remainingInteractions = room.MaxInteractions - currentContributions;

        // Obtener las contribuciones de la historia
        const storyQuery = 'SELECT StoryText FROM stories WHERE RoomID = ? ORDER BY StoryID';
        const [storyContributions] = await db.promise().query(storyQuery, [room.RoomID]);
        const storyText = storyContributions.map(contribution => contribution.StoryText).join("\n");

        res.status(200).json({
            story: storyText,
            isFinalized: room.IsFinalized === 1,
            remainingInteractions: remainingInteractions > 0 ? remainingInteractions : 0 // Asegurarse de que no sea negativo
        });
    } catch (err) {
        console.error('Error al obtener la historia:', err);
        res.status(500).send('Error al procesar la solicitud');
    }
});

//endpoint obtener palabras clave
app.get('/api/get-keywords/:roomCode', async (req, res) => {
    try {
      const roomCode = req.params.roomCode;
      // Reemplaza esta consulta SQL según la estructura de tu base de datos
      const query = 'SELECT Keywords FROM gamerooms WHERE RoomCode = ?';
      const [rows] = await db.promise().query(query, [roomCode]);
  
      if (rows.length > 0) {
        res.json({ keywords: rows[0].Keywords });
      } else {
        res.status(404).send('No se encontraron palabras clave para esta sala');
      }
    } catch (error) {
      console.error('Error al obtener las palabras clave:', error);
      res.status(500).send('Error interno del servidor');
    }
  });

// info user sidebar
app.get('/api/user-info/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params;
    console.log(`Obteniendo información del usuario para el ID: ${userId}`);

    try {
        const query = 'SELECT Username, DisplayName, ProfilePicture, UserCode FROM users WHERE UserID = ?';
        console.log(`Ejecutando consulta: ${query} con UserId: ${userId}`);
        const [users] = await db.promise().query(query, [userId]);
        
        console.log('Resultado de la consulta:', users);
        if (users.length > 0) {
            res.status(200).json(users[0]);
        } else {
            console.log('Usuario no encontrado para el ID:', userId);
            res.status(404).send('Usuario no encontrado');
        }
    } catch (err) {
        console.error('Error al obtener información del usuario:', err);
        res.status(500).send('Error al procesar la solicitud');
    }
});

// actualizar info user sidebar
app.put('/api/update-user/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params;
    const { Username, profilePicture } = req.body; // Asumiendo que estos datos vienen del cuerpo de la solicitud

    try {
        const updateQuery = 'UPDATE users SET Username = ?, ProfilePicture = ? WHERE UserID = ?';
        await db.promise().query(updateQuery, [Username, profilePicture, userId]);
        res.status(200).send('Información del usuario actualizada');
    } catch (err) {
        console.error('Error al actualizar información del usuario:', err);
        res.status(500).send('Error al procesar la solicitud');
    }
});

// Obtener información del usuario para la página de ajustes
app.get('/api/user-settings/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params;

    try {
        const query = 'SELECT UserID, Username, DisplayName, ProfilePicture, IsVerified FROM users WHERE UserID = ?';
        const [users] = await db.promise().query(query, [userId]);
        if (users.length > 0) {
            res.status(200).json(users[0]); // Esto ahora incluye IsVerified
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (err) {
        console.error('Error al obtener información del usuario:', err);
        res.status(500).send('Error al procesar la solicitud');
    }
});

// Actualizar información del usuario
app.put('/api/update-user-settings/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params;
    const { username, newPassword, displayName, profilePicture, passwordActual } = req.body;

    try {
        // Obtener la contraseña actual del usuario de la base de datos
        const userQuery = 'SELECT Password FROM users WHERE UserID = ?';
        const [users] = await db.promise().query(userQuery, [userId]);
        if (users.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        const user = users[0];

        // Verificar que la contraseña actual proporcionada sea correcta
        const isMatch = await bcrypt.compare(passwordActual, user.Password);
        if (!isMatch) {
            return res.status(401).send('Contraseña actual incorrecta');
        }

        // Preparar la actualización de los campos que han sido modificados
        const camposParaActualizar = [];
        const valoresParaActualizar = [];

        if (username) {
            camposParaActualizar.push('Username = ?');
            valoresParaActualizar.push(username);
        }
        if (newPassword) {
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            camposParaActualizar.push('Password = ?');
            valoresParaActualizar.push(hashedNewPassword);
        }
        if (displayName) {
            camposParaActualizar.push('DisplayName = ?');
            valoresParaActualizar.push(displayName);
        }
        if (profilePicture) {
            camposParaActualizar.push('ProfilePicture = ?');
            valoresParaActualizar.push(profilePicture);
        }

        // Realizar la actualización si hay campos para actualizar
        if (camposParaActualizar.length > 0) {
            const updateQuery = `UPDATE users SET ${camposParaActualizar.join(', ')} WHERE UserID = ?`;
            await db.promise().query(updateQuery, [...valoresParaActualizar, userId]);
            res.status(200).send('Información del usuario actualizada');
        } else {
            res.status(400).send('No hay datos para actualizar');
        }
    } catch (err) {
        console.error('Error al actualizar información del usuario:', err);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.post('/api/anonymize-user/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params;
    const { passwordActual } = req.body; // La contraseña actual enviada desde el cliente

    if (!passwordActual) {
        return res.status(400).send('La contraseña actual es necesaria para eliminar la cuenta.');
    }

    try {
        // Primero, obtén la contraseña almacenada para este usuario
        const [user] = await db.promise().query(
            'SELECT Password FROM users WHERE UserID = ?',
            [userId]
        );

        if (user.length === 0) {
            return res.status(404).send('Usuario no encontrado.');
        }

        // Verifica que la contraseña proporcionada sea correcta
        const isMatch = await bcrypt.compare(passwordActual, user[0].Password);
        if (!isMatch) {
            return res.status(401).send('Contraseña incorrecta.');
        }

        // Si la contraseña es correcta, procede a "eliminar" la cuenta
        await db.promise().query(
            "UPDATE users SET Username = '', Password = '', Email = '', DisplayName = '', ProfilePicture = '', VerificationToken = '', IsVerified = 0 WHERE UserID = ?",
            [userId]
          );

        res.send('Cuenta eliminada con éxito.');
    } catch (error) {
        console.error('Error al eliminar la cuenta:', error);
        res.status(500).send('Error interno del servidor.');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
