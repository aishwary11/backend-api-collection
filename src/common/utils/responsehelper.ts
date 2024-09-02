import { Response } from 'express';
export default {
  successResp: async (res: Response, statusCode: number = 200, msg: string = '', data?: any) => res.status(statusCode).json({ statusCode, msg, data }),
  errorResp: async (res: Response, statusCode: number = 400, msg: string = '') => res.status(statusCode).json({ statusCode, msg }),
};
