import {Device} from "./device";

export class Location {
  identifier: string;
  type: String;
  name: String;
  position: {
    lat: number;
    lng: number;
  };
  devices: Device[];
}
