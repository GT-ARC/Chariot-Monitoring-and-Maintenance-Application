import {Location} from "./location";

export class Floor {
  identifier: string;
  name: string;
  level: number;
  locations: Location[] = [];
  public isMock: boolean = false;

  constructor(identifier: string, name: string, level: number, locations: Location[]) {
    this.identifier = identifier;
    this.name = name;
    this.level = level;
    this.locations = locations;
  }


}
