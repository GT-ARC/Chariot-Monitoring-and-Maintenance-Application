import {ProductProcess} from "./productProcess";

export class Container {

  identifier: number;

  name: string;

  maxProductStorage: number;
  maxWeight: number;

  containerInfo: {
    name: string;
    value: string;
  }[];

  products: ProductProcess[];
}
