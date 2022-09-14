import { RequestHandler } from 'express';
import that from './purpose.service';
import slug from 'slug'
import { uploadToCloudinary } from '../helpers';
const { createPurposeService , getListPurposeService} = that
interface responseService {
    code: number;
    message: string;
    purpose: any;
    purposes: any;
  }
export const createPurpose: RequestHandler = async (req, res, next) => {
    try{
        const file: any = req.file;
        if (!file) return;
        let urls = await uploadToCloudinary(file.path);
        if(!urls) return;
        const { name, color } = req.body
        const createSlug = slug(name)
        const {code, message, purpose} = await createPurposeService({name, color,thumbnail: urls, slug: createSlug}) as responseService
        res.status(code).json({
            message: message,
            purpose,
        });
    }
    catch(err) {
        console.error(err);
    }
}
export const getListPurpose: RequestHandler = async(req, res, next) => {
  try {
    const {code, message, purposes} = await getListPurposeService() as responseService
    res.status(code).json({
        message: message,
        purposes,
    });
  } 
  catch(err) {
    console.error(err);
  } 
}