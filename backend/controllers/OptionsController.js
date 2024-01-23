import { connection } from "../config/db.js";

const getCategories = (req, res) =>{
    const getCategoriesQuery = "Select id_category, name_category, description_category from category";

    connection.query(getCategoriesQuery, (categoriesError, categoryResult) =>{

        if(categoriesError){
            console.error("Ocurrio un error en la consulta de categorias: " + categoriesError);
                res.status(500).json({
                    message: "Ooops! ha ocurrido un error"
                });
                return;
        }

        if(categoryResult.length < 1){
            res.status(200).json({
                message: "No existen o no se pudieron cargar las categorias..."
            })
            return;
        } else{
            res.status(200).json({
                categoryResult
            })
        }
    })

}


const getStatuses = (req, res) =>{
    const getStatusesQuery = "Select id_status, name_status, description_status from status";

    connection.query(getStatusesQuery, (statusError, statusResult) =>{

        if(statusError){
            console.error("Ocurrio un error en la consulta de categorias: " + statusError);
                res.status(500).json({
                    message: "Ooops! ha ocurrido un error"
                });
                return;
        }

        if(statusResult.length < 1){
            res.status(200).json({
                message: "No existen o no se pudieron cargar los estados..."
            })
            return;
        } else{
            res.status(200).json({
                statusResult
            })
        }
    })

}


const OptionController = {
    getCategories,
    getStatuses
}

export default OptionController;