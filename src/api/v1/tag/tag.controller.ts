import { RequestHandler } from 'express';
import that from './tag.service';
import slug from 'slug'
const { createTagService , getListTagService} = that
interface responseService {
    code: number;
    message: string;
    tag: any;
    tags: any;
  }
export const createTag: RequestHandler = async (req, res, next) => {
    try{
        const { name } = req.body
        const createSlug = slug(name)
        const {code, message, tag} = await createTagService({name,  slug: createSlug}) as responseService
        res.status(code).json({
            message: message,
            tag,
        });
    }
    catch(err) {
        console.error(err);
    }
}
export const getListTag: RequestHandler = async(req, res, next) => {
  try {
    const {code, message, tags} = await getListTagService() as responseService
    res.status(code).json({
        message: message,
        tags,
    });
  } 
  catch(err) {
    console.error(err);
  } 
}