import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

// Funcion para hashear un password
const encryptPwd = (pwd) => {
    try {

        const pwdHashed = bcrypt.hash(pwd, 10);
        return pwdHashed;
    } catch (error) {
        console.error('Error al encriptar clave: ' + error.message);
    }
}


// Funcion para comparar el password hasheado
const comparePassword = (pwd, pwdHashed) => {
    try {
        const pwdMatch = bcrypt.compare(pwd, pwdHashed);
        return pwdMatch;
    } catch (error) {
        console.error('Error al comparar clave: ' + error.message);
    }
}

// Funcion para crear un token
const createToken = (data) => {
    try {

        const token = jsonwebtoken.sign(data, process.env.token_key, { expiresIn: '1h' });
        return token;

    } catch (error) {
        console.error('Error al crear el token');
    }
}

const checkToken = (req, res, next) => {
    const token = req.headers.authorization;
    try {
        jsonwebtoken.verify(token, process.env.token_key, (error, decode) => {
            if (error) {
                res.status(403).json({
                    message: "No tienes permiso para realizar esto, primero debes iniciar sesion"
                });
                return;
            }
            if (decode) {
                next();
            }
        });
    } catch (error) {
        console.error('Error al comprobar el token');
        res.status(500).json({
            message: 'Ha ocurrido un error'
        })
    }
}

const AuthMiddleware = {
    encryptPwd,
    comparePassword,
    createToken,
    checkToken
}

export default AuthMiddleware;