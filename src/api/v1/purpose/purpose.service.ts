import _Purpose from './Purpose.model';
import Purpose from '../interfaces/Purpose';

const that = {
  createPurposeService: async ({ name, slug, thumbnail, color }: Purpose) => {
    try {
      const purpose = await _Purpose.create({ name, thumbnail, slug, color });
      return {
        code: 201,
        message: 'success',
        purpose,
      };
    } catch (err) {
      console.error(err);
    }
  },
  getListPurposeService: async () => {
    try {
      const purposes = await _Purpose.find()
      return {
        code: 200,
        message: 'success',
        purposes,
      };
    } catch (err) {
      console.error(err);
    }
  },
};

export default that;
