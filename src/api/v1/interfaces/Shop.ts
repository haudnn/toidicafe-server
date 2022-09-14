type address = {
  [key: string]: any
}
type price = { 
  [key: string]: number
}
type social = { 
  [key: string]: string
}
type time = { 
  [key: string]: string
}
export default interface Shop {
    name: string;
    images: Array<string>;
    description: string;
    region: String;
    address: address;
    price: price
    purposes: Array<string>;
    tags: Array<string>;
    benefits: Array<string>;
    // menu:  Array<string>;
    social: social;
    time: time;
    slug: string;
  }