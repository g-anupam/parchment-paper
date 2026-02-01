import { asyncHandler } from "../utils/asyncHandler.js";
import { Note } from "../models/note.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendSuccess, sendError } from "../utils/responseFormatter.js";
import { HTTP_STATUS } from "../constants.js";

/**
 * @desc    Create a new Note (with optional image)
 * @route   POST /api/v1/notes
 */
export const createNote = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    // 1. Handle optional image upload to Cloudinary
    let imageUrl = "";
    if (req.file) {
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        imageUrl = cloudinaryResponse?.url || "";
    }

    // 2. Create note and link to the logged-in user
    const note = await Note.create({
        title,
        content,
        imageUrl,
        owner: req.user._id // Provided by verifyJWT
    });

    return sendSuccess(res, HTTP_STATUS.CREATED, "Note created successfully", note);
});

/**
 * @desc    Get all notes for the logged-in user
 * @route   GET /api/v1/notes
 */
export const getNotes = asyncHandler(async (req, res) => {
    // We sort by 'createdAt' in descending order to show newest notes first
    const notes = await Note.find({ owner: req.user._id }).sort({ createdAt: -1 });
    
    return sendSuccess(res, HTTP_STATUS.OK, "Notes retrieved successfully", notes);
});

/**
 * @desc    Update a specific note
 * @route   PATCH /api/v1/notes/:id
 */
export const updateNote = asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    const { id } = req.params;

    // 1. Find the note first to verify ownership and check if it exists
    const existingNote = await Note.findOne({ _id: id, owner: req.user._id });
    if (!existingNote) {
        return sendError(res, HTTP_STATUS.NOT_FOUND, "Note not found or unauthorized");
    }

    let updateData = { title, content };

    // 2. Handle new image if provided
    if (req.file) {
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        updateData.imageUrl = cloudinaryResponse?.url;
    }

    // 3. Update the note
    const updatedNote = await Note.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
    );

    return sendSuccess(res, HTTP_STATUS.OK, "Note updated successfully", updatedNote);
});

/**
 * @desc    Delete a note
 * @route   DELETE /api/v1/notes/:id
 */
export const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Ensure the note exists and belongs to the user before deleting
    const note = await Note.findOneAndDelete({ 
        _id: id, 
        owner: req.user._id 
    });

    if (!note) {
        return sendError(res, HTTP_STATUS.NOT_FOUND, "Note not found or unauthorized");
    }

    return sendSuccess(res, HTTP_STATUS.OK, "Note deleted successfully");
});