import cors from 'cors';
import 'dotenv/config';
import express, { Express } from 'express';
import fileUpload from 'express-fileupload';
import logger from './common/middleware/logger';
import swaggerRoute from './routes/swagger.routes';

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(fileUpload());
// app.get('/', (req: Request, res: Response) => responsehelper.successResp(res, 200, 'Successfully Deployed'));
app.use('/swagger', swaggerRoute);
process.on('uncaughtException', (err: Error) => {
  console.log(`Error: ${err.message} \n Error stack: ${err.stack}`);
  process.exit(1);
});
app.listen(port, () => console.log(`[*] Server Start at ${port}`));
