import { Request } from "express";
import path from "path";
import multer from "multer";
import crypto from "crypto";

const allowedMimeFormats = [
  'image/jpeg', 
  'image/jpg', 
  'image/png'
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(6).toString('hex');
    const filename = `${hash}_${file.originalname}`;
    cb(null, filename);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  const isMimeTypeValid = allowedMimeFormats.includes(file.mimetype);

  return isMimeTypeValid
    ? cb(null, true)
    : cb(new Error('O formato do arquivo da imagem é inválido (deve ser ".png", ".jpeg" ou ".jpg")'), false);
};


const uploads = multer({
  storage,
  limits: {
      fileSize: 3 * 1024 * 1024
  },
  fileFilter
});

export default uploads;