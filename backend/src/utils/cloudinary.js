import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "google-keep-replica", // 🔥 Keeps your Cloudinary dashboard organized
        });

        // File has been uploaded successfully
        console.log("✅ File is uploaded on Cloudinary ", response.url);
        
        // Asynchronous cleanup (non-blocking)
        fs.unlink(localFilePath, (err) => {
            if (err) console.error("Error deleting local file:", err);
        });

        return response;
        
    } catch (error) {
        console.error("!!! CLOUDINARY UPLOAD ERROR !!!:", error);
        
        // Ensure local file is removed even if upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        return null;
    }
};

export { uploadOnCloudinary };