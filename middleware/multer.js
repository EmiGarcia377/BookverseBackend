import multer from "multer";

const storage = multer.memoryStorage();
const multerMiddleware = multer({ storage });
export { multerMiddleware };
export const uploadSingleAvatars = multerMiddleware.single('avatars');
export const uploadSingleCover = multerMiddleware.single('book-covers');