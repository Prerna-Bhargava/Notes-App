const Note = require('../modals/noteModal')
const asyncHandler = require('express-async-handler');

const getNotes = asyncHandler(
    async (req, res) => {
        const notes = await Note.find({ user: req.user._id });
        res.json(notes);
    }
)

const createNotes = asyncHandler(
    async (req, res) => {
        const { title, content, category } = req.body;

        if (!title || !content || !category) {
            res.status(400);
            throw new Error('Please fill all the fields')
        }
        else {
            // req.user we r getting from protect middlware
            const note = new Note({ user: req.user._id, title, content, category })

            const createdNote = await note.save();
            res.status(201).json(createdNote)
        }

    }
)

const getNoteById = asyncHandler(
    async (req, res) => {
        const note = await Note.findById(req.params.id);
        if (note) {
            res.json(note);

        }
        else {
            res.status(404)
                .json({ message: "Note Not Found" })
        }
    })


const updateNote = asyncHandler(
    async (req, res) => {
        const { title, content, category } = req.body;
        const note = await Note.findById(req.params.id);

        // Checking if note belongs to the user currently logged in
        if (note.user.toString() != req.user._id.toString()) {
            res.json(401);
            throw new Error("You can't perform this functionn");
        }
        if (note) {
            note.title = title;
            note.content = content;
            note.category = category;
            const updatedNote = await note.save()
            res.json(updatedNote);

        }

        else {
            res.status(404)
                .json({ message: "Note Not Found" })
        }
    })

const deleteNote = asyncHandler(
    async (req, res) => {
        const note = await Note.findById(req.params.id);
        if (note.user.toString() != req.user._id.toString()) {
            res.json(401);
            throw new Error("You can't perform this functionn");
        }
        if (note) {
            await note.remove()
            res.json({ message: "Note Removed" });

        }
        else {
            res.status(404)
                .json({ message: "Note Not Found" })
        }
    })



module.exports = { getNotes, createNotes, getNoteById, updateNote, deleteNote };