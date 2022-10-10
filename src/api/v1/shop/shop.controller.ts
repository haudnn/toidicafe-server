import  jwt,{ JwtPayload } from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { uploadToCloudinary } from '../helpers';
import that from './shop.service';
import slug from 'slug'
import console from 'console';
interface responseService {
  code: number;
  message: string;
  meta: any;
  shop?: any;
  shops?: Array<any>;
}
interface query {
  name: any;
  area: any;
}
const {
  createShopService,
  updateShopService,
  deleteShopService,
  listShopService,
  bookmarksShopService,
  unbookmarkShopService,
  getBookmarksService,
  searchPlaceService,
  getShopBySlugService,
  getPhotosShopService,
  searchShopByNameService
} = that;
import dotenv from 'dotenv';
dotenv.config();
const { JWT_KEY} = process.env;
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
      address,
      price,
      purposes,
      tags,
      benefits,
      social,
      time,
      region
    } = req.body;
    let images: any = urls;
    const createSlug = slug(name)
    const { code, shop, message } = (await createShopService({
      name,
      description,
      slug: createSlug,
      address,
      price,
      purposes,
      tags,
      benefits,
      social,
      time,
      images,
      region
    })) as responseService;
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
  let {data} = req.body;
  // const files: any = req.files;
  // if (files.length > 0) {
  //   const urls = [];
  //   for (const file of files) {
  //     const uploadedResponse = await uploadToCloudinary(file.path);
  //     urls.push(uploadedResponse);
  //   }
  //   data = { ...data, images: urls };
  // }

  try {
    const { code, shop, message } = (await updateShopService(shopId, data)) as responseService;
    res.status(code).json({
      message: message,
      shop,
    });
  } catch (err) {
    console.error(err);
  }
};
export const deleteShop: RequestHandler = async (req, res, next) => {
  try {
    const { shopId } = req.params;
    const { code, message } = (await deleteShopService(shopId)) as responseService;
    res.status(code).json({
      message: message,
    });
  } catch (err) {
    console.error(err);
  }
};
export const listShops: RequestHandler = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const { code, shops, message } = (await listShopService(+page)) as responseService;
    res.status(code).json({
      message: message,
      shops,
    });
  } catch (err) {
    console.error(err);
  }
};

export const bookmarkShop: RequestHandler = async (req, res, next) => {
  const { shopId} = req.body;
  const userId = req.user
  try {
    const { code, message } = (await bookmarksShopService(shopId, userId)) as responseService;
    return res.status(code).json({
      message: message,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Không thể thêm cửa hàng vào bookmarks!',
    });
  }
};
export const unbookmarkShop: RequestHandler = async (req, res, next) => {
  const { shopId} = req.body;
  const userId = req.user
  try {
    const { code, message } = (await unbookmarkShopService(shopId, userId)) as responseService;
    return res.status(code).json({
      message: message,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Không thể xóa cửa hàng khỏi bookmarks!',
    });
  }
};
export const getBookmarks: RequestHandler = async (req, res, next) => {
  try {
    const { openning, region} = req.query
    const userId = req.user
    const {code, message, shops } = await getBookmarksService(userId, { openning, region}) as responseService;
    return res.status(code).json({
      message: message,
      shops
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Không thể fetching shops',
    });
  }
};
export const searchPlace: RequestHandler = async (req, res, next): Promise<any> => {  
  const query = req.body
  try{  
    const {code, message, meta,shops} = await searchPlaceService(query) as responseService
    return res.status(code).json({
      message: message,
      meta,
      shops
    })
  }catch(err){
    console.log(err)
  }
}
export const getShopBySlug: RequestHandler = async (req, res, next): Promise<any> =>  {
  const {slug} = req.params
  const token = req.headers.authorization?.split(' ')[1];
  try{
    let decoded;
    if(token) {
      decoded = jwt.verify(token, JWT_KEY || '') as JwtPayload;
      if (!decoded){
        return res.status(401).json({ message: "Authorization not valid" });
      }
    }
    const {code, message, shop} = await getShopBySlugService(slug, decoded) as responseService
    return res.status(code).json({
      message: message,
      shop
    })
  }
  catch(err){
    return res.status(403).json({message: "Authentication failed"})
  }
}
export const getPhotosShop: RequestHandler = async (req, res, next): Promise<any> => { 
  const {slug} = req.params
  try { 
    const {code, message, shop} = await getPhotosShopService(slug) as responseService
    return res.status(code).json({
      message: message,
      shop
    })
  }
  catch(err){
    console.log(err)
  }
}
export const searchShopByName : RequestHandler = async (req, res, next): Promise<any> => { 
  try {
    const query = req.query.q
    console.log(query)
    if(!query) {
      return res.status(200).json({
        message: 'success',
        shops : []
      })
    }
    const {code, message, shops } = await searchShopByNameService(query) as responseService
    return res.status(code).json({
      message: message,
      shops
    })
  }
  catch(err) {  console.log(err)  }
}

