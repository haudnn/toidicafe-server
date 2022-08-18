import multer from 'multer';
const storage = multer.diskStorage({})
export const fileUpload = multer({storage: storage});
