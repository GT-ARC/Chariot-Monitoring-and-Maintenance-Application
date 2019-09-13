import {Issue} from "./issue";
import {DeviceGroup} from './deviceGroup';

export class Device {
  identifier: string;

  deviceGroup: boolean = false;
  deviceGroupObj: DeviceGroup = null;

  name: string;
  symbol: symbol;

  power_consumption: number;

  properties: Property [];

  running: number;
  down_time: number;

  description: {
    title: string,
    desc: string }[];
  issues: Issue[];

  constructor(identifier: string,
              name: string,
              symbol: symbol,
              power_consumption: number,
              running: number,
              down_time: number,
              description: { title: string, desc: string }[],
              issues?: Issue[]) {
    this.identifier = identifier;
    this.name = name;
    this.symbol = symbol;
    this.power_consumption = power_consumption;
    this.running = running;
    this.down_time = down_time;
    this.description = description;
    this.issues = issues;
  }


  getIssueID(): string {
    if(this.issues){
      let retID = this.issues.reduceRight((previousValue, currentValue) => !currentValue.state ?  "" + currentValue.identifier : "", "");
      return retID == "" ? "" + this.identifier : "i" + retID;
    }
    return "";
  }

  hasIssue(): number {
    return this.issues.reduce((prev, curr) => curr.state == false ? prev + 1 : prev, 0)
  }
}

export class Property {
  url: string;
  timestamp: number;
  topic?: string;
  type: string;
  name?: string;
  key: string;
  value: number | string | boolean | Property[];
  min_value?: any;
  max_value?: any;
  unit?: string;
  writable: boolean;

  data: {
    y: number,
    x: number
  }[];
  prediction: {
    y: number,
    x: number
  }[];


  constructor(
    timestamp: number,
    type: string,
    key: string,
    value: number | string | boolean | Property[],
    writable: boolean,
    topic?: string,
    name?: string,
    unit?: string,
    min_value?: number,
    max_value?: number,
  ) {
    this.timestamp = timestamp;
    this.type = type;
    this.key = key;
    this.value = value;
    this.writable = writable;
    this.topic = topic;
    this.name = name;
    this.unit = unit;
    this.min_value = min_value;
    this.max_value = max_value;
  }

  createMockData( data: { y: number, x: number }[],
                  prediction: { y: number, x: number }[]) {
    this.data = data;
    this.prediction = prediction;
  }

}
