import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

const storage = multer.memoryStorage();

const up = multer({
  storage,
  fileFilter: function (req, file, cb) {
    return file.mimetype === 'text/csv' ? cb(null, true) : cb(null, false);
  },
});

export const upload = (req: Request, res: Response, next: NextFunction) => {
  return up.single('file')(req, res, next);
};
