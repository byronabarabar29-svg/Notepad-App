import express from 'express'
import { addNote, addTask, checkTask, deleteNote, deleteTask, editTask, getCheckedTasks, getNote, getNotes } from '../controllers/noteControllers.js'

export const noteRoutes = express.Router()

noteRoutes.get('/', getNotes)
noteRoutes.get('/:id', getNote)
noteRoutes.post('/', addNote)


// Delete Note
noteRoutes.delete('/:id', deleteNote)

// Update Note
noteRoutes.patch('/:id/tasks', checkTask)


// TASK FUNCTIONS
noteRoutes.post('/:id/tasks', addTask)
noteRoutes.delete('/:id/tasks', deleteTask)
noteRoutes.patch('/:id/tasks', editTask)
noteRoutes.get('/:id/tasks',getCheckedTasks)
