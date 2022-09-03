import { RequestHandler } from 'express';
import { uploadToCloudinary } from '../helpers';
import that from './shop.service';

interface responseService {
  code: number;
  message: string;
  shop: any;
  shops: Array<any>;
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
  filterShopByAreaService,
  filterShopByTypeService,
  bookmarksShopService,
  unbookmarkShopService,
  getBookmarksService,
  getShopByIdService,
  getSearchResultsService
} = that;
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
      tags,
      types,
      utilities,
      facebook,
      instagram,
      timeOpen,
      timeClose,
    } = req.body;
    let images: any = urls;
    const { code, shop, message } = (await createShopService({
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
      images,
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
  let data = req.body;
  const files: any = req.files;
  if (files.length > 0) {
    const urls = [];
    for (const file of files) {
      const uploadedResponse = await uploadToCloudinary(file.path);
      urls.push(uploadedResponse);
    }
    data = { ...data, images: urls };
  }

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
export const filterShopByArea: RequestHandler = async (req, res, next) => {
  try {
    const { shopArea } = req.body;
    const { code, shops, message } = (await filterShopByAreaService(shopArea)) as responseService;
    res.status(code).json({
      message: message,
      shops,
    });
  } catch (err) {
    console.error(err);
  }
};
export const filterShopByTypes: RequestHandler = async (req, res, next) => {
  try {
    const { shopTypes } = req.body;
    const { code, shops, message } = (await filterShopByTypeService(shopTypes)) as responseService;
    res.status(code).json({
      message: message,
      shops,
    });
  } catch (err) {
    console.error(err);
  }
};
export const bookmarkShop: RequestHandler = async (req, res, next) => {
  const { shopId, userId } = req.body;
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
  const { shopId, userId } = req.body;
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
    const { userId } = req.body;
    const {code, message, shops } = await getBookmarksService(userId) as responseService;
    return res.status(code).json({
      message: message,
      shops:  shops.map((shop) => shop.toObject({ getters: true }))
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Không thể fetching shops',
    });
  }
};
export const getShopById: RequestHandler = async (req, res, next) => {
  const { shopId } = req.params
  try{
    const {code, message, shop} = await getShopByIdService(shopId) as responseService;
    return res.status(code).json({
      message: message,
      shop
    });

  }catch(err){
    return res.status(500).json({
      message: 'Không thể fetching shops',
    });
  }
}
export const searchShops: RequestHandler = async (req, res, next) => {
  const {q} = req.query
  const query:any= {}
  if(q) {
    const options = '$options';
    query.name = { $regex: q, [options]: 'i' };
    // query.area = { $regex: q, [options]: 'i' };
  }
  try{  
    const {code, message, shops} = await getSearchResultsService(query, q) as responseService
    return res.status(code).json({
      message: message,
      shops
    })
  }catch(err){
    console.log(err)
  }
}