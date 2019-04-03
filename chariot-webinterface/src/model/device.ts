import {Location} from "./location";
import {Issue} from "./issue";
import {run} from "tslint/lib/runner";

export class Device {
  identifier: number;

  name: string;
  symbol: symbol;

  power_state: boolean;
  power_consumption: number;

  running: number;
  down_time: number;

  description: { title: string, desc: string }[];
  issues: Issue[];

  data: { y: number, x: number }[];
  prediction: { y: number, x: number }[];

  constructor(identifier: number,
              name: string,
              symbol: symbol,
              power_state: boolean,
              power_consumption: number,
              running: number,
              down_time: number,
              description: { title: string, desc: string }[],
              issues: Issue[],
              data: { y: number, x: number }[],
              prediction: { y: number, x: number }[]) {
    this.identifier = identifier;
    this.name = name;
    this.symbol = symbol;
    this.power_state = power_state;
    this.power_consumption = power_consumption;
    this.running = running;
    this.down_time = down_time;
    this.description = description;
    this.issues = issues;
    this.data = data;
    this.prediction = prediction;
  }

  hasIssue(): number {
    return this.issues.reduce((prev, curr) => curr.state == false ? prev + 1 : prev, 0)
  }
}
