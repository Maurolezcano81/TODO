import express from 'express';
import TaskController from '../controllers/TaskControllers.js';
const router = express.Router();

router.post('/', TaskController.createTask);
router.get('/', TaskController.getTasks);
router.get('/:id_task', TaskController.getTask);
router.delete('/:id_task', TaskController.deleteTask);
router.patch('/:id_task', TaskController.updateTask);


export default router;