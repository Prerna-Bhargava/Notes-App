const express = require('express');
const { getNotes,createNotes, getNoteById, updateNote, deleteNote} = require('../controllers/noteControllers');
const {protect}  = require('../middlewares/authMiddlware')

const router = express.Router();

// Get all notes
router.route('/').get(protect, getNotes)

// Create note
router.route('/create').post(protect, createNotes)

router.route('/:id').get(protect,getNoteById);

router.route('/:id').put(protect,updateNote);

router.route('/:id').delete(protect,deleteNote);


module.exports = router
