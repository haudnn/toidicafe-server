import _Benefit from './benefit.model';
import Benefit from '../interfaces/Benefit';

const that = {
  createBenefitService: async ({ name, slug, icon }: Benefit) => {
    try {
      const benefit = await _Benefit.create({ name, icon, slug });
      return {
        code: 201,
        message: 'success',
        benefit,
      };
    } catch (err) {
      console.error(err);
    }
  },
  getListBenefitService: async () => {
    try {
      const benefits = await _Benefit.find()
      return {
        code: 200,
        message: 'success',
        benefits,
      };
    } catch (err) {
      console.error(err);
    }
  },
};

export default that;
