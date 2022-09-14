import _Tag from './tag.model';
import Tag from '../interfaces/Tag';

const that = {
  createTagService: async ({ name, slug}: Tag) => {
    try {
      const tag = await _Tag.create({ name, slug });
      return {
        code: 201,
        message: 'success',
        tag,
      };
    } catch (err) {
      console.error(err);
    }
  },
  getListTagService: async () => {
    try {
      const tags = await _Tag.find()
      return {
        code: 200,
        message: 'success',
        tags,
      };
    } catch (err) {
      console.error(err);
    }
  },
};

export default that;
