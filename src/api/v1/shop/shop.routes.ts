import express from 'express';
import { fileUpload } from '../middlewares/fileUpload';
import {
  createShop,
  updateShop,
  deleteShop,
  filterShopByArea,
  listShops,
  filterShopByTypes,
  searchShops,
  bookmarkShop,
  unbookmarkShop,
  getBookmarks, 
  getShopById
} from './shop.controller';
import verifyToken from '../middlewares/verifyToken';
const router = express.Router();

router.post('/', fileUpload.array('image'), createShop);
router.post('/area', filterShopByArea);
router.post('/types', filterShopByTypes);
router.get('/search?', searchShops);
router.get('/', listShops);

router.use(verifyToken);


router.patch('/:shopId', fileUpload.array('image'), updateShop);
router.delete('/:shopId', deleteShop);
router.get('/:shopId', getShopById)
router.post('/bookmark', bookmarkShop);
router.post('/unbookmark', unbookmarkShop);
router.get('/bookmark', getBookmarks);



export default router;
