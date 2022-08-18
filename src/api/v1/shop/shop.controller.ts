import { RequestHandler } from 'express';
import { uploadToCloudinary } from '../helpers';
import that from './shop.service';

interface reponseService {
  code: number;
  message: string;
  shop: any;
}
const { createShopService, updateShopService } = that;
export const createShop: RequestHandler = async (req, res, next) => {
  try {
    const urls = [];
    const files: any = req.files;
    if (!files) return;
    for (const file of files) {
      const uploadedResponse = await uploadToCloudinary(file.path);
      urls.push(uploadedResponse);
    }
    const {
      name,
      description,
      area,
      location,
      priceMin,
      priceMax,
      types,
      tags,
      utilities,
      facebook,
      instagram,
      timeOpen,
      timeClose,
    } = req.body;
    let images:any = urls;
    const { code, shop, message } = await createShopService({
      name,
      description,
      area,
      location,
      priceMin,
      priceMax,
      types,
      tags,
      utilities,
      facebook,
      instagram,
      timeOpen,
      timeClose,
      images
    }) as reponseService;
    res.status(code).json({
      message: message,
      shop,
    });
  } catch (err) {
    console.error(err);
  }
};


export const updateShop: RequestHandler = async (req, res, next) => {
  const { shopId } = req.params;
  let data = req.body
  const files: any = req.files
  if(files.length > 0) { 
    const urls = []
    for (const file of files) {
      const uploadedResponse = await uploadToCloudinary(file.path);
      urls.push(uploadedResponse);
    }
    data = { ...data, images: urls };
  }

  try{ 
    console.log("ctrl",data)
    const { code, shop, message } = await updateShopService(shopId, data) as reponseService
    res.status(code).json({
      message: message,
      shop,
    });
  } catch (err) {
    console.error(err);
  }
}

 