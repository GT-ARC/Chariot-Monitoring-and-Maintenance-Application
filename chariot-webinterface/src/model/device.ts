import {Location} from "./location";
import {Issue} from "./issue";

export class Device {
  identifier: number;

  name: string;
  symbol: symbol;

  power_state: boolean;
  power_consumption: number;

  running: number;
  down_time: number;

  description: {title:string, desc:string}[];
  issues: Issue[];

  data: {y: number, x: number}[];
  prediction: {y: number, x: number}[];
}
