import _Region from './region.model';
import Region from '../interfaces/Region';

const that = {
  createRegionService: async ({ name, slug, thumbnail }: Region) => {
    try {
      const region = await _Region.create({ name, thumbnail, slug });
      return {
        code: 201,
        message: 'success',
        region,
      };
    } catch (err) {
      console.error(err);
    }
  },
  updateRegionService: async (id:any, data:Object) => {
    try{
      const region = await _Region.findByIdAndUpdate(id, data, {
        new: true,
        runValidator: true,
      });
      return {  
        code: 200,
        message: 'success',
        region,
      };
    }catch (err) {
      console.error(err);
    }

  },
  getListRegionService: async () => {
    try {
      const regions = await _Region.find()
      return {
        code: 200,
        message: 'success',
        regions,
      };
    } catch (err) {
      console.error(err);
    }
  },
};

export default that;
