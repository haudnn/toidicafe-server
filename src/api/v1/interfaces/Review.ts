interface Star {
  name: string;
  point: number;
}

export default interface Review {
  title: string;
  body: string;
  shop: string;
  star: Array<Star>;
  images: Array<string>;
  anonymous: string;
  author: string;
}
