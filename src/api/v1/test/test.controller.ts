  import { RequestHandler } from 'express';
  import _Benefit from '../benefit/benefit.model';
  import _Purpose from '../purpose/Purpose.model';
  import _Tag from '../tag/tag.model';
  import _Region from '../region/region.model'
  export const testapi: RequestHandler = async (req, res, next) => {
    try {
      const {data} = req.body
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };
