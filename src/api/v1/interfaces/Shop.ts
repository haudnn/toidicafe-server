
export default interface Shop {
    name: string;
    images: Array<string>;
    description: string;
    area: string;
    location: string;
    priceMin: string;
    priceMax: string;
    types: Array<string>;
    tags: Array<string>;
    utilities: Array<string>;
    // menu:  Array<string>;
    facebook: string;
    instagram: string;
    timeOpen: string;
    timeClose: string;
  }