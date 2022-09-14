import { RequestHandler } from 'express';
import that from './region.service';
import slug from 'slug'
import { uploadToCloudinary } from '../helpers';
const { createRegionService ,  updateRegionService ,getListRegionService} = that
interface responseService {
    code: number;
    message: string;
    region: any;
    regions: any;
  }
export const createRegion: RequestHandler = async (req, res, next) => {
    try{
        const file: any = req.file;
        if (!file) return;
        let urls = await uploadToCloudinary(file.path);
        if(!urls) return;
        const { name} = req.body
        const createSlug = slug(name)
        const {code, message, region} = await createRegionService({name, thumbnail: urls, slug: createSlug}) as responseService
        res.status(code).json({
            message: message,
            region,
        });
    }
    catch(err) {
        console.error(err);
    }
}
export const getListRegion: RequestHandler = async(req, res, next) => {
  try {
    const {code, message, regions} = await getListRegionService() as responseService
    res.status(code).json({
        message: message,
        regions,
    });
  } 
  catch(err) {
    console.error(err);
  } 
}
export const updateRegion: RequestHandler = async(req, res, next) => {
  try {
    const {id} = req.params
    const data = req.body;
    const {code, message, region} = await updateRegionService(id, data) as responseService
    res.status(code).json({
        message: message,
        region,
    });
  } 
  catch(err) {
    console.error(err);
  } 
}