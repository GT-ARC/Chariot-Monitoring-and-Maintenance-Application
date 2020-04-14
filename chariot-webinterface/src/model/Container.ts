import {Product} from "./Product";

export class Container {

  identifier: number;

  name: string;

  maxProductStorage: number;
  maxWeight: number;

  containerInfo: {
    name: string;
    value: string;
  }[];

  products: Product[];
}
