import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import responseHelper from '../utils/responsehelper';

const fileExt = (extension: string) => (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.files?.jsonFile as UploadedFile;
  return path.extname(name) === extension ? next() : responseHelper.errorResp(res, 400, `Only ${extension} file is allowed`);
};
export default fileExt;
