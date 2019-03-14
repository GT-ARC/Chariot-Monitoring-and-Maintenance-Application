import {Location} from "./location";
import {Issue} from "./issue";

export class Device {
  idenfitifier: number;

  name: string;
  symbole: symbol;


  power_state: boolean;
  power_consumption: number;

  running: number;
  down_time: number;

  description: {title:string, desc:string}[];
  issues: Issue[];

  timeline: [];
}
