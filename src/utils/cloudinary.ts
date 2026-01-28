import { v2 as cloudinary } from 'cloudinary';

// Automatically reads from CLOUDINARY_URL
cloudinary.config();

export default cloudinary;
