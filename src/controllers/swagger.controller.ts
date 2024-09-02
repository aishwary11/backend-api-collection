import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import db from '../common/utils/db';
import postmanToSwagger from '../common/utils/postmantoswagger';
import responseHelper from '../common/utils/responsehelper';

export default {
  getSwaggerPage: async (req: Request, res: Response) => {
    let { appName, apiName, version, filename } = req.params;
    let filePath = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });
    return res.sendFile(filePath + filename);
  },
  getNav: async (req: Request, res: Response) => {
    try {
      let nav = await db.select('navigation').from('nav');
      return responseHelper.successResp(res, 200, '', nav);
    } catch (error) {
      return responseHelper.errorResp(res, 400, `Error while fetching Navigation`);
    }
  },
  getNames: async (req: Request, res: Response) => {
    try {
      let appNames = await db.select('*').from('app');
      let apiNames = await db.select('*').from('api');
      return responseHelper.successResp(res, 200, '', { appNames, apiNames });
    } catch (error) {
      return responseHelper.errorResp(res, 400, `Error while fetching App Name`);
    }
  },
  postAppName: async (req: Request, res: Response) => {
    let { appname } = req.body;
    try {
      await db('app').insert({ appname });
      return responseHelper.successResp(res, 200, `${appname} saved`);
    } catch (error) {
      return responseHelper.errorResp(res, 400, `Error while saving ${error}`);
    }
  },
  postApiName: async (req: Request, res: Response) => {
    let { apiname } = req.body;
    try {
      await db('api').insert({ apiname: apiname });
      return responseHelper.successResp(res, 200, `${apiname} saved`);
    } catch (error) {
      return responseHelper.errorResp(res, 400, `Error while saving ${error}`);
    }
  },
  collectionToSwagger: async (req: Request, res: Response) => {
    const { appId, apiId, version } = req.body;
    if (req.files?.jsonFile) {
      const { name, data } = req?.files?.jsonFile as UploadedFile;
      const parseData = JSON.parse(data.toString());
      const jsonString = JSON.stringify(parseData);
      if (!jsonString.includes(version)) return responseHelper.errorResp(res, 400, 'Please check version');
      const fileName = path.parse(name).name;
      try {
        await postmanToSwagger(JSON.stringify(parseData), path.join(__dirname, `../uploads/${fileName}.yml`));
        await db('versioning').insert({ app_id: appId, api_id: apiId, version, filename: fileName + '.yml' });
        const versionData = await db('versioning').join('app', 'versioning.app_id', '=', 'app.id').join('api', 'versioning.api_id', '=', 'api.id').select('versioning.version', 'app.appname', 'api.apiname', 'versioning.filename');
        const convertedData: any = JSON.stringify(transformData(versionData));
        const navData = await db.select('id').from('nav');
        if (!navData.length) await db('nav').insert({ navigation: convertedData });
        else await db('nav').where('id', navData[0].id).update({ navigation: convertedData });
        return responseHelper.successResp(res, 200, 'File converted successfully.');
      } catch (error) {
        return responseHelper.errorResp(res, 500, `Error in conversion: ${error}`);
      }
    } else return responseHelper.errorResp(res, 400, 'Something Went Wrong');
  },
};

function transformData(data: any) {
  const map = new Map();
  for (const { appname, apiname, version, filename } of data) {
    let appObj = map.get(appname) || { appname, apiname: [] };
    let apiObj = appObj.apiname.find((api: any) => api.name === apiname);
    if (!apiObj) {
      apiObj = { name: apiname, versions: [] };
      appObj.apiname.push(apiObj);
    }
    apiObj.versions.push({ version, filename });
    map.set(appname, appObj);
  }
  return Array.from(map.values());
}
