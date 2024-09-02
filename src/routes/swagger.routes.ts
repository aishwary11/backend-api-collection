import { Router } from 'express';
import fileExt from '../common/middleware/fileExt';
import swaggerController from '../controllers/swagger.controller';

const router: Router = Router();
router.get('/getNav', swaggerController.getNav);
router.get('/getNames', swaggerController.getNames);
router.post('/postAppName', swaggerController.postAppName);
router.post('/postApiName', swaggerController.postApiName);
router.get('/:appName/:apiName/:version/:filename', swaggerController.getSwaggerPage);
router.post('/collection', fileExt('.json'), swaggerController.collectionToSwagger);

export default router;
