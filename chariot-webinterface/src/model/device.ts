export class Device {
  uuid: number;

  name: string;
  symbole: symbol;

  floor: number;
  room: number;

  power_state: boolean;
  power_consumption: number;

  running: number;
  down_time: number;

  description: [];
  issues: [];

  timeline: [];

  cordinates: {
    x: number;
    y: number;
  }
}
