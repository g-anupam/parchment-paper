import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    createNote, 
    getNotes, 
    updateNote, 
    deleteNote 
} from "../controllers/note.controller.js";

const router = Router();

// Apply security to ALL routes in this file
router.use(verifyJWT); 

router.route("/")
    .get(getNotes) // Fetch all notes for the user
    .post(upload.single("image"), createNote); // Create a note (image is the key name)

router.route("/:id")
    .patch(upload.single("image"), updateNote) // Update note content or image
    .delete(deleteNote); // Remove note

export default router;