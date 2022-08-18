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
  deleteShopService: async (shopId: string) => {},
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
      console.log('service', data);
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
        shop
      };
    } catch (err) {
      console.log(err);
    }
  },
};

export default that;
