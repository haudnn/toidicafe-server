import Shop from '../interfaces/Shop';
import _Shop from './shop.model';

const that = {
  createShopService: async ({
    name,
    images,
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
  }: Shop) => {
    try {
      const shop = await _Shop.create({
        name,
        images,
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
      });
      return {
        code: 201,
        message: 'success',
        shop: {
          name: shop.name,
          description: shop.description,
          shopId: shop.id,
          images: shop.images,
          area: shop.area,
          location: shop.location,
          priceMin: shop.priceMin,
          priceMax: shop.priceMax,
          types: shop.types,
          tags: shop.tags,
          utilities: shop.utilities,
          facebook: shop.facebook,
          instagram: shop.instagram,
          timeOpen: shop.timeOpen,
          timeClose: shop.timeClose,
        },
      };
    } catch (err) {
      console.error(err);
    }
  },
  updateShopService: async (shopId: string, data: any) => {
    try {
      await _Shop.findById({ _id: shopId });
    } catch (error) {
      return {
        code: 500,
        message: 'Không thể tìm thấy cửa hàng, vui lòng thử lại sau!',
      };
    }
    try {
      const shop = await _Shop.findByIdAndUpdate(shopId, data, {
        new: true,
        runValidator: true,
      });
      if (!shop) {
        return {
          code: 500,
          message: 'Không thể cập nhật cửa hàng, vui lòng thử lại sau!',
        };
      }
      return {
        code: 200,
        message: 'success',
        shop,
      };
    } catch (err) {
      console.log(err);
    }
  },
  deleteShopService: async (shopId: string) => {
    try {
      await _Shop.findById(shopId);
    } catch (err) {
      return {
        code: 404,
        message: 'Không thể tìm thấy cửa hàng, vui lòng thử lại sau!',
      };
    }
    try {
      await _Shop.findByIdAndDelete(shopId);
      return {
        code: 201,
        message: 'Xóa cửa hàng thành công!',
      };
    } catch (err) {
      console.log(err);
    }
  },
  listShopService: async (page: number = 1) => {
    try {
      const pagesize = 10;
      const shops = await _Shop
        .find()
        .skip((page - 1) * pagesize)
        .limit(pagesize);
      return {
        code: 200,
        message: 'success',
        shops,
      };
    } catch (err) {
      console.log(err);
    }
  },
  filterShopByAreaService: async (shopArea: Array<string>) => {
    try {
      const shops = await _Shop.find({ area: { $in: shopArea } });
      return {
        code: 200,
        message: 'success',
        shops,
      };
    } catch (err) {
      console.log(err);
    }
  },
  filterShopByTypeService: async (shopType: Array<string>) => {
    // types: [Sống ảo, Hẹn hò, Đọc sách]
    // types: [Sống ảo, Hẹn hò],'
    try {
      const shops = await _Shop.find({ types: { $all: shopType } });
      return {
        code: 200,
        message: 'success',
        shops,
      };
    } catch (err) {
      console.log(err);
    }
  },
  bookmarksShopService: async (shopId: string, userId: string) => {
    try {
      await _Shop.findByIdAndUpdate(shopId, { $addToSet: { bookmarks: userId } }, { new: true });
      return {
        code: 200,
        message: 'success',
      };
    } catch (err) {
      console.log(err);
    }
  },
  unbookmarkShopService: async (shopId: string, userId: string) => {
    try {
      await _Shop.findByIdAndUpdate(shopId, { $pull: { bookmarks: userId } }, { new: true });
      return {
        code: 200,
        message: 'success',
      };
    } catch (err) {
      console.log(err);
    }
  },
  getBookmarksService: async (userId: string) => {
    try {
      const shops  = await _Shop.find({bookmarks: userId})
      return {
        code : 200, 
        message: 'success',
        shops
      }
    } catch (err){
      console.log(err);
    }
  },
  getShopByIdService: async (shopId: string) => {
    try{
      const shop = await _Shop.findById(shopId)
      .populate('reviews')
      return {
        code: 200,
        message: 'success',
        shop
      }
    }catch(err){
      console.log(err)
    }
  },
  getSearchResultsService: async (query:any, area:any) => {
    let shops;
    try {
      shops = await _Shop.find(query)
      if(shops.length === 0 ) {
        shops = await _Shop.find({$text : {$search : area}})
      }
      return {
        code : 200,
        message: 'success',
        shops
      }
    }
    catch(err) {
      console.log(err)
    }
  }
};

export default that;
