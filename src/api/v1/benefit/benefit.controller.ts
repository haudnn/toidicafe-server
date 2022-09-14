import { RequestHandler } from 'express';
import that from './benefit.service';
import slug from 'slug'
const { createBenefitService , getListBenefitService} = that
interface responseService {
    code: number;
    message: string;
    benefit: any;
    benefits: any;
  }
export const createBenefit: RequestHandler = async (req, res, next) => {
    const { name, icon} = req.body
    const createSlug = slug(name)
    try{
        const {code, message, benefit} = await createBenefitService({name, icon, slug: createSlug}) as responseService
        res.status(code).json({
            message: message,
            benefit,
        });
    }
    catch(err) {
        console.error(err);
    }
}
export const getListBenefit: RequestHandler = async(req, res, next) => {
  try {
    const {code, message, benefits} = await getListBenefitService() as responseService
    res.status(code).json({
        message: message,
        benefits,
    });
  } 
  catch(err) {
    console.error(err);
  } 
}