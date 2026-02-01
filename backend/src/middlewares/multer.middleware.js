import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Directs the file to your temporary local storage folder
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      // Generates a unique name to prevent collisions: fieldname-timestamp-random.extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

export const upload = multer({ 
    storage 
});