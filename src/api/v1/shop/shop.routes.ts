
import express from 'express';
import { fileUpload } from '../middlewares/fileUpload';
import {
  createShop,
  updateShop,
  deleteShop,
  bookmarkShop,
  unbookmarkShop,
  getBookmarks, 
  searchPlace,
  getShopBySlug,
  getPhotosShop,
  searchShopByName,
} from './shop.controller';
import verifyToken from '../middlewares/verifyToken';
const router = express.Router();

router.post('/', fileUpload.array('image'), createShop);
router.get('/:slug', getShopBySlug)
router.get('/:slug/photo', getPhotosShop)
router.delete('/:shopId', deleteShop);
router.post('/search', searchPlace)
router.patch('/:shopId' , updateShop);
router.get('/search/select',searchShopByName)


router.use(verifyToken);

router.post('/bookmark',  bookmarkShop);
router.post('/unbookmark',  unbookmarkShop);
router.get('/bookmark/saved',  getBookmarks);


export default router;
