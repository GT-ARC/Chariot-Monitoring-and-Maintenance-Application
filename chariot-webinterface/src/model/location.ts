import {DeviceGroup} from './deviceGroup';

export class Location {

  private readonly _identifier: number;
  private readonly _type: String;
  private readonly _name: String;
  private readonly _position: {
    lat: number;
    lng: number;
  };
  private _devices: DeviceGroup[];

  constructor(identifier: number, type: String, name: String, position: { lat: number; lng: number }) {
    this._identifier = identifier;
    this._type = type;
    this._name = name;
    this._position = position;
  }

  public addDeviceGroup(deviceGroup: DeviceGroup): void {
    this._devices.push(deviceGroup);
  }

  get devices(): DeviceGroup[] {
    return this._devices;
  }

  get identifier(): number {
    return this._identifier;
  }

  get type(): String {
    return this._type;
  }

  get name(): String {
    return this._name;
  }

  get position(): { lat: number; lng: number } {
    return this._position;
  }
}
