import multer from "multer";
import AppError from "./appError.js";

const multerStorage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("please enter image files only"), false);
  }
};

export const upload = multer({
  storage: multerStorage,
  fileFilter,
});
