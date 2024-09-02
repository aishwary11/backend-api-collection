import { NextFunction, Request, Response } from 'express';
import pc from 'picocolors';

const logger = (req: Request, _: Response, next: NextFunction): void => {
  const { method, originalUrl } = req;
  const date = new Date(new Date().toISOString()).toLocaleString();
  console.log(pc.blue(`[${date}] ${method} ${originalUrl}`));
  next();
};

export default logger;
