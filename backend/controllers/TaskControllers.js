import { connection } from "../config/db.js";

const createTask = (req, res) => {

    const { id_user, name_task, description, name_category } = req.body;

    const defaultStatus = 1;

    const checkUser = "SELECT id_user from user where id_user = ?";
    const checkCategory = "SELECT id_category from category where id_category = ?"

    const createTaskQuery = 'INSERT INTO user_task(fk_user, name_task, description_task, fk_category, fk_status, created_at, updated_at) VALUES (?,?, ?, ?, ?, ?, ?)';

    try {
        connection.query(checkUser, [id_user], (userError, userResult) => {

            if (userError) {
                console.error("Error en la consulta de la comprobacion del usuario: " + userError);
                res.status(500).json({
                    message: "Ooops! Algo ha salido mal..."
                });
            }

            if (userResult.length < 1) {
                res.status(403).json({
                    message: "Para poder realizar esta accion primero debes iniciar sesión..."
                });
                return;
            }

            connection.query(checkCategory, [name_category], (categoryError, categoryResult) => {
                if (categoryError) {
                    console.error("Error en la consulta de la categoria: " + categoryError);
                    res.status(500).json({
                        message: "Ooops! Algo ha salido mal"
                    })
                }

                if (categoryResult.length < 1) {
                    res.status(403).json({
                        message: "Seleccione una categoria valida."
                    });
                    return;
                }

                const values = [id_user, name_task, description, name_category, defaultStatus, new Date(), new Date()];
                connection.query(createTaskQuery, values, (createError, createResult) => {

                    if (createError) {
                        console.error("Error al crear la tarea: " + createError);
                        res.status(500).json({
                            message: "Ooops! Algo ha salido mal"
                        })
                        return;
                    }

                    res.status(200).json({
                        message: "Tarea creada exitosamente"
                    });
                })

            })

        })

    } catch (error) {
        console.error(error.message);
    }
}

const getTasks = (req, res) => {

    const { id_user } = req.body;

    try {

        const TasksQuery = `
            SELECT description_task, ut.created_at, ut.updated_at, s.name_status, c.name_category FROM user_task ut
            JOIN user u ON ut.fk_user = u.id_user
            join status s on ut.fk_status = s.id_status
            join category c on ut.fk_category = c.id_category
            where ut.fk_user = ?
        `

        connection.query(TasksQuery, [id_user], (tasksError, tasksResult) => {
            if (tasksError) {
                console.error("Error al obtener las tareas: " + tasksResult);
                res.status(500).json({
                    message: "Ooops! ha ocurrido un error, intentelo de nuevo más tarde"
                })
                return;
            }

            if (tasksResult.length < 1) {
                res.status(200).json({
                    message: "Aun no tiene tareas, intenta creando nuevas"
                });
                return;
            } else {
                res.status(200).json({
                    tasksResult
                });
                return;
            }
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Ooops! ha ocurido un error"
        })
    }
}

const getTask = (req, res) => {

    const { id_task } = req.params;
    const { id_user } = req.body;

    const TaskQuery = `
            SELECT description_task, ut.created_at, ut.updated_at, s.name_status, c.name_category FROM user_task ut
            JOIN user u ON ut.fk_user = u.id_user
            join status s on ut.fk_status = s.id_status
            join category c on ut.fk_category = c.id_category
            where ut.fk_user = ? and ut.id_task = ?
        `

    try {

        const values = [id_user, id_task]

        connection.query(TaskQuery, values, (taskError, taskResult) => {
            if (taskError) {
                console.error("Error al obtener la tarea: " + taskError)
                res.status(500).json({
                    message: "Ooops! ha ocurrido un error"
                });
                return;
            }


            if (taskResult.length < 1) {
                res.status(200).json({
                    message: "La tarea buscada no existe..."
                });
                return;
            } else {
                res.status(200).json({
                    taskResult: taskResult[0]
                })
            }
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Ooops! ha ocurido un error"
        })
    }
}

const deleteTask = (req, res ) =>{
    const { id_task } = req.params;
    const { id_user } = req.body;

    const deleteTaskQuery = "DELETE FROM user_task where fk_user = ? and id_task = ?";

    try {
        const values = [id_user, id_task];
        connection.query(deleteTaskQuery, values, (deleteTaskError, deleteTaskResult ) =>{
            if(deleteTaskError){
                console.error("Ocurrio un error en la consulta de borrar: " + deleteTaskError);
                res.status(500).json({
                    message: "Ooops! ha ocurrido un error"
                });
                return;
            }

            console.log(deleteTaskResult)
            if(deleteTaskResult.affectedRows < 1){
                res.status(200).json({
                    message: "Ha ocurrido un error al eliminar la tarea!"
                });
            } else{
                console.log(deleteTaskResult)
                res.status(200).json({
                    message: "La tarea ha sido borrada exitosamente"
                });
            }

        });    
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Ooops! ha ocurido un error"
        })
    }
}



const updateTask = ( req, res ) =>{

    const { id_task } = req.params;

    const { name_task, fk_user, description_task, fk_category, fk_status } = req.body;

    const updateTaskQuery = "UPDATE user_task SET name_task = ?, description_task = ?, fk_category = ?, fk_status = ? where fk_user = ? and id_task = ?";

    try {
        const values = [name_task, description_task, fk_category, fk_status, fk_user, id_task];

        connection.query( updateTaskQuery, values, (updateTaskError, updateTaskResult) => {

            if(updateTaskError){
                console.error("Ocurrio un error en la consulta de borrar: " + updateTaskError);
                res.status(500).json({
                    message: "Ooops! ha ocurrido un error"
                });
                return;
            }

            if(updateTaskResult.affectedRows < 1){
                res.status(200).json({
                    message: "Ha ocurrido un error al actualizar la tarea..."
                })
            } else{
                res.status(200).json({
                    message: "La tarea se actualizo correctamente"
                })
            }

        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Ooops! ha ocurido un error"
        })
    }
}


const taskController = {
    createTask,
    getTasks,
    getTask,
    deleteTask,
    updateTask,
}

export default taskController;