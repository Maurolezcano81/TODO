import { connection } from "../config/db.js";

const signUp = (req, res) =>{

// FALTAN LAS VALIDACIONES;

    // Pido los datos del cuerpo de la peticion;
    const { name, lastname, alias, email, pwd } = req.body;

    // Realizo la consulta con parametrizacion de datos;
    const query = "INSERT INTO user(name_user, lastname_user, alias_user, email_user, pwd_user, created_at, updated_at) VALUES(?,?,?,?,?,?,?)";

    // Almaceno en un array los datos de la peticion;
    const values = [name, lastname, alias, email, pwd, new Date(), new Date()];

    // Realizo la consulta;
    connection.query(query, values, (error, resultado)=>{
        if(error){
            console.error("Error en la consulta: ", error);
            res.status(500).json({message:"Error en el registro"});
        } else{
            console.log("Usuario registrado exitosamente");
            res.status(200).json({message:"Usuario registrado exitosamente"});
            connection.end();
        }
    })
};


// Preparo un objeto con las funciones a exportar;
const userController = {
    signUp,
}

// Exporto el objeto;
export default userController;