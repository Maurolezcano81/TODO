import { connection } from "../config/db.js";
import AuthMiddleware from "../middlewares/Auth.js";

const signUp = async (req, res) => {

    try {
        // Pido los datos del cuerpo de la peticion;
        const { name, lastname, alias, email, pwd } = req.body;

        // Variables con las consultas
        const checkAlias = 'SELECT alias_user from user WHERE alias_user = ?';
        const checkEmail = 'SELECT email_user FROM user WHERE email_user = ?';
        const signUp = 'INSERT INTO user(name_user, lastname_user, alias_user, email_user, pwd_user, created_at, updated_at) values(?,?,?,?,?,?,?)';

        // Comprobar Alias en la BD;
        connection.query(checkAlias, [alias], (aliasError, aliasResult) => {
            if (aliasError) {
                console.error('Error en la consulta de alias: ' + aliasError);
                res.status(500).json({
                    message: 'Error en el registro'
                })
                return;
            };

            if (aliasResult.length > 0) {
                res.status(403).json({
                    message: 'El nombre de usuario ya esta siendo utilizado'
                })
                return;
            }

            // Comprobar Email en la BD;
            connection.query(checkEmail, [email], (emailError, emailResult) => {
                if (emailError) {
                    console.error('Error en la consulta de email: ' + emailError);
                    res.status(500).json({
                        message: 'Error en el registro'
                    })
                };

                if (emailResult.length > 0) {
                    res.status(403).json({
                        message: 'El email ya esta siendo utilizado'
                    });
                    return;
                }


                // Encriptar password

                AuthMiddleware.encryptPwd(pwd)
                    .then(pwdEncripted => {
                        if (!pwdEncripted) {
                            res.status(500).json({
                                message: "Error en el registro"
                            })
                            return;
                        }

                        // Registrar usuario en la BD;
                        const values = [name, lastname, alias, email, pwdEncripted, new Date(), new Date()];

                        connection.query(signUp, values, (signUpError, signUpResult) => {
                            if (signUpError) {
                                console.error('Error al insertar al usuario en la BD: ' + signUpError);
                                res.status(500).json({
                                    message: 'Error en el registro'
                                })
                            };

                            res.status(200).json({
                                message: 'Usuario registrado exitosamente'
                            });
                            return;
                        })
                    }).catch(error => {
                        console.error('Error al encriptar clave: ' + error.message);
                        res.status(500).json({ message: 'Error en el registro' });
                    });
            });
        });
    } catch (error) {
        console.error('Error al registrar usuario: ' + error.message);
    }
};

const signIn = (req, res) => {
    try {
        const { inputLogin, pwd } = req.body;
        const queryLogin = 'SELECT * FROM user WHERE alias_user = ? or email_user = ?';
        const values = [inputLogin, inputLogin];

        // Obtener usuario por nombre de usuario
        connection.query(queryLogin, values, async (loginError, loginResult) => {
            if (loginError) {
                console.log('Error en el login: ' + loginError);
                return res.status(500).send({
                    message: 'Error al iniciar sesión'
                });
            }

            if (loginResult.length > 0) {
                const hashedPassword = loginResult[0].pwd_user;

                const data ={
                    id_user: loginResult[0].id_user,
                    name_user: loginResult[0].name_user,
                    lastname_user: loginResult[0].lastname_user,
                    email_user: loginResult[0].email_user,
                }

                console.log(data);
                const token = AuthMiddleware.createToken(data);

                try {
                    const passwordMatch = await AuthMiddleware.comparePassword(pwd, hashedPassword);
                    if (passwordMatch) {
                        return res.status(200).send({
                            message: 'Sesión iniciada correctamente',
                            token
                        });
                    } else {
                        return res.status(401).send({
                            message: 'Credenciales incorrectas'
                        });
                    }
                } catch (compareError) {
                    console.error('Error al comparar contraseñas: ', compareError);
                    return res.status(500).send({
                        message: 'Error al iniciar sesión'
                    });
                }
            } else {
                return res.status(401).send({
                    message: 'Credenciales incorrectas'
                });
            }
        });
    } catch (error) {
        console.error('Error al iniciar sesión: ', error);
        return res.status(500).send({
            message: 'Error al iniciar sesión'
        });
    }
};


// Preparo un objeto con las funciones a exportar;
const userController = {
    signUp,
    signIn
}

// Exporto el objeto;
export default userController;