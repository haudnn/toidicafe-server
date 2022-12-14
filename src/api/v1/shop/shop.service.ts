import { createPurpose } from './../purpose/purpose.controller';
import { calculateTime, formatPrice } from './../helpers/index';
import Shop from '../interfaces/Shop';
import _Shop from './shop.model';
import _Benefit from '../benefit/benefit.model';
import _Tag from '../tag/tag.model';
import _Region from '../region/region.model';
import _Purpose from '../purpose/Purpose.model';
import _Review from '../review/review.model';
import _User from '../user/user.model';
const that = {
  createShopService: async ({
    name,
    description,
    address,
    price,
    purposes,
    tags,
    benefits,
    images,
    social,
    time,
    slug,
    region,
  }: Shop) => {
    try {
      const shop = await _Shop.create({
        name,
        slug,
        images,
        description,
        time,
        social,
        address,
        price,
      });
      const [benefitList, purposeList, tagList, regionFound] = await Promise.all([
        _Benefit.find({ slug: { $in: benefits } }).select('id'),
        _Purpose.find({ slug: { $in: purposes } }).select('id'),
        _Tag.find({ slug: { $in: tags } }).select('id'),
        _Region.find({ slug: region }).select('id shop'),
      ]);
      benefitList.forEach(async (benefit: any) => {
        await _Benefit.findByIdAndUpdate(
          benefit._id,
          { $addToSet: { shop: shop._id } },
          { new: true }
        );
      });
      purposeList.forEach(async (purpose: any) => {
        await _Purpose.findByIdAndUpdate(
          purpose._id,
          { $addToSet: { shop: shop._id } },
          { new: true }
        );
      });
      tagList.forEach(async (tag: any) => {
        await _Tag.findByIdAndUpdate(tag._id, { $addToSet: { shop: shop._id } }, { new: true });
      });
      let countShop: any = regionFound[0].shop.length + 1;
      await _Region.findByIdAndUpdate(
        regionFound[0]._id,
        { $addToSet: { shop: shop._id, count: countShop } },
        { new: true }
      );
      return {
        code: 201,
        message: 'success',
        shop: shop,
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
        message: 'Kh??ng th??? t??m th???y c???a h??ng, vui l??ng th??? l???i sau!',
      };
    }
    try {
      if (data.benefits) await that.updateShopRelationship(data.benefits, shopId, 'benefit');
      if (data.tags) await that.updateShopRelationship(data.tags, shopId, 'tag');
      if (data.purposes) await that.updateShopRelationship(data.purposes, shopId, 'purpose');
      if (data.region) {
        const find = await _Region.findOne({ shop: data.shopId });
        await _Region.findByIdAndUpdate(find?.id, { $pull: { shop: shopId } }, { new: true });
        _Region.findOneAndUpdate(
          { slug: data.region },
          { $addToSet: { shop: shopId } },
          { new: true }
        );
      }
      const shop = await _Shop.findByIdAndUpdate(shopId, data, {
        new: true,
        runValidator: true,
      });

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
        message: 'Kh??ng th??? t??m th???y c???a h??ng, vui l??ng th??? l???i sau!',
      };
    }
    try {
      await _Shop.findByIdAndDelete(shopId);
      return {
        code: 201,
        message: 'X??a c???a h??ng th??nh c??ng!',
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
  getBookmarksService: async (userId: string, query: any) => {
    try {
      let { openning, region } = query;
      openning = openning || 'false';
      region = region || 'all';
      let shops;
      let shopsFirstTime = await _Shop.find({ bookmarks: userId });
      const format = shopsFirstTime.map((shop) => {
        const close: any = shop?.time?.close;
        const open: any = shop?.time?.open;
        const status = calculateTime(open, close);
        return {
          id: shop.id,
          time: shop.time,
          name: shop.name,
          address: shop.address,
          bookmarks: shop.bookmarks,
          price: {
            min: shop?.price?.min,
            max: shop?.price?.max,
          },
          slug: shop.slug,
          images: shop.images[0],
          status,
        };
      });
      if (openning === 'false' && region === 'all') {
        shops = format;
      }
      if (openning === 'true') {
        shops = format.filter((shop) => shop.status === 'openning' || shop.status === 'closeSoon');
      }
      if (region !== 'all') {
        const regionFound: any = await _Region.findOne({ slug: region }).select('shop');
        if (openning === 'true') {
          shops = format.filter((shop) => {
            return (
              (regionFound.shop.includes(shop.id) && shop.status === 'openning') ||
              shop.status === 'closeSoon'
            );
          });
        }
        if (openning === 'false') {
          shops = format.filter((shop) => {
            return regionFound.shop.includes(shop.id);
          });
        }
      }

      return {
        code: 200,
        message: 'success',
        shops,
      };
    } catch (err) {
      console.log(err);
    }
  },
  searchPlaceService: async (query: any) => {
    try {
      const pagesize = 10;
      const { page, regions, purposes, benefits, tags, openning } = query;
      let shops;
      if (
        regions.length === 0 &&
        purposes.length === 0 &&
        benefits.length === 0 &&
        tags.length == 0
      ) {
        const shopsFirstTime = await _Shop
          .find()
          .skip((page - 1) * pagesize)
          .limit(pagesize);

        if (openning) {
          const shopsFilter = shopsFirstTime.map((shop) => {
            const close: any = shop?.time?.close;
            const open: any = shop?.time?.open;
            const status = calculateTime(open, close);
            return (
              status === 'openning' && {
                id: shop.id,
                time: shop.time,
                name: shop.name,
                address: shop.address,
                bookmarks: shop.bookmarks,
                price: {
                  min: shop.price?.min,
                  max: shop.price?.max,
                },
                slug: shop.slug,
                images: shop.images[0],
                status,
              }
            );
          });
          shops = shopsFilter.filter((shop) => shop);
        } else {
          shops = shopsFirstTime.map((shop: any) => {
            const close: any = shop?.time?.close;
            const open: any = shop?.time?.open;
            const status = calculateTime(open, close);
            return {
              id: shop.id,
              time: shop.time,
              name: shop.name,
              address: shop.address,
              bookmarks: shop.bookmarks,
              price: {
                min: shop.price.min,
                max: shop.price.max,
              },
              slug: shop.slug,
              images: shop.images[0],
              status,
            };
          });
        }
        return {
          code: 200,
          message: 'success',
          meta: {
            page,
            pagesize,
            total: shops.length,
          },
          shops,
        };
      }
      const [listShopByRegion, listShopByPurpose, listShopByBenefit, listShopByTag] =
        await Promise.all([
          _Region.find({ slug: { $in: regions } }).select('shop'),
          _Purpose.find({ slug: { $in: purposes } }).select('shop'),
          _Benefit.find({ slug: { $in: benefits } }).select('shop'),
          _Tag.find({ slug: { $in: tags } }).select('shop'),
        ]);
      const covert: any = listShopByRegion;
      const listShop = covert.concat(listShopByPurpose, listShopByBenefit, listShopByTag);
      let tmp: any = [];
      for (let i = 0; i < listShop.length; i++) {
        tmp = [...tmp, listShop[i].shop];
      }
      const result = tmp.flat(Infinity);
      const shopsFirstTime = await _Shop
        .find({ _id: { $in: result } })
        .skip((page - 1) * pagesize)
        .limit(pagesize);
      if (openning) {
        const shopsFilter = shopsFirstTime.map((shop) => {
          const close: any = shop?.time?.close;
          const open: any = shop?.time?.open;
          const status = calculateTime(open, close);
          return (
            status === 'openning' && {
              id: shop.id,
              time: shop.time,
              name: shop.name,
              address: shop.address,
              bookmarks: shop.bookmarks,
              price: {
                min: shop.price?.min,
                max: shop.price?.max,
              },
              slug: shop.slug,
              images: shop.images[0],
              status,
            }
          );
        });
        shops = shopsFilter.filter((shop) => shop);
      } else {
        shops = shopsFirstTime.map((shop: any) => {
          const close: any = shop?.time?.close;
          const open: any = shop?.time?.open;
          const status = calculateTime(open, close);
          return {
            id: shop.id,
            time: shop.time,
            name: shop.name,
            address: shop.address,
            bookmarks: shop.bookmarks,
            price: {
              min: shop.price.min,
              max: shop.price.max,
            },
            slug: shop.slug,
            images: shop.images[0],
            status,
          };
        });
      }
      return {
        code: 200,
        message: 'success',
        meta: {
          page,
          pagesize,
          total: shops.length,
        },
        shops,
      };
    } catch (err) {
      console.log(err);
    }
  },
  getShopBySlugService: async (slug: string, decoded: any) => {
    try {
      let isBookMark = false;
      let userId;
      const shop = await _Shop.findOne({ slug: slug });
      if(decoded){
        const user = await _User.findOne({ _id: decoded.userId });
        userId = user?.id
      }
      if(userId){
        const find = await _Shop.findOne({ slug: slug , bookmarks :{  $in: userId}})
        if(find) isBookMark = true;
      }
      if (!shop) {
        return {
          code: 500,
          message: "Can't find shop with slug",
        };
      }
      const benefits = await _Benefit.find({ shop: shop.id }).select('name icon');
      const tags = await _Tag.find({ shop: shop.id }).limit(2).select('name slug');
      const reviews = await _Review
        .find({ shop: shop.id })
        .populate('author', 'userName displayName images')
        .select('avgStar anonymous title body date images star');
      let reviewsCount;
      let avgRateShop;
      let totalStar;
      if(reviews.length > 0) {
        const len = reviews.length;
        const getKeys: any = reviews[0].star;
        const keys = Object.keys(getKeys);
        const total = reviews.reduce(
          (obj: any, cur: any) => {
            keys.forEach((key: any) => {
              obj[key] = cur.star[key] + obj[key];
            });
            return obj;
          },
          {
            position: 0,
            space: 0,
            price: 0,
            drink: 0,
            service: 0,
          }
        );
        totalStar = {
          ...total,
          position: Math.round(total.position / len),
          space: Math.round(total.space / len),
          price: Math.round(total.price / len),
          drink: Math.round(total.drink / len),
          service: Math.round(total.service / len),
        };
        avgRateShop = Math.round((totalStar.position +
          totalStar.space +
          totalStar.price +
          totalStar.drink +
          totalStar.service) /
        5);
      }

      const open: any = shop?.time?.open;
      const close: any = shop?.time?.close;
      const status = calculateTime(open, close);
      return {
        code: 200,
        message: 'success',
        shop: {
          id: shop.id,
          time: shop.time,
          name: shop.name,
          social: shop.social,
          address: shop.address,
          price: {
            min: formatPrice(shop?.price?.min),
            max: formatPrice(shop?.price?.max),
          },
          isBookMark,
          reviewsCount,
          avgRateShop,
          menu: shop.menu,
          slug: shop.slug,
          images: shop.images,
          imagesCount: shop.images.length,
          description: shop.description,
          totalStar,
          reviews,
          benefits,
          tags,
          status,
        },
      };
    } catch (err) {
      console.log(err);
    }
  },
  updateShopRelationship: async (data: any, shopId: any, label: string) => {
    let name: any;
    if (label === 'benefit') {
      name = _Benefit;
    }
    if (label === 'tag') {
      name = _Tag;
    }
    if (label === 'purpose') {
      name = _Purpose;
    }
    let idList = await name?.find({ shop: shopId }).select('id');
    idList?.forEach(async (id: any) => {
      await name?.findByIdAndUpdate(id, { $pull: { shop: shopId } }, { new: true });
    });
    let relaList = await name?.find({ slug: { $in: data } }).select('id');
    relaList.forEach(async (rela: any) => {
      await name?.findByIdAndUpdate(rela._id, { $addToSet: { shop: shopId } }, { new: true });
    });
  },
  getPhotosShopService: async (slug: string) => {
    try {
      const shop = await _Shop.findOne({ slug: slug }).select('name address images');
      if (!shop) {
        return {
          code: 401,
          message: 'Something went wrong!',
        };
      }
      return {
        code: 200,
        message: 'success',
        shop,
      };
    } catch (e) {
      console.log(e);
    }
  },
  searchShopByNameService: async (query: any) => {
    try {
      const shops = await _Shop
        .find({ $text: { $search: `"${query}"` } })
        .select('id name address images slug');
      if (!shops) {
        return {
          code: 401,
          message: 'Something went wrong!',
        };
      }
      return {
        code: 200,
        message: 'success',
        shops,
      };
    } catch (e) {
      console.log(e);
    }
  },

};

export default that;
