import multer from "multer";

const storage = multer.memoryStorage();
const multerMiddleware = multer({ storage });
export { multerMiddleware };
export const uploadSingle = multerMiddleware.single('avatars');