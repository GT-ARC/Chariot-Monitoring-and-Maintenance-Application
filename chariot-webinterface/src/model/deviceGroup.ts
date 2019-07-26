import {Device} from './device';

export class DeviceGroup {

  private _identifier : number;
  private _devices : Device[];

  constructor(identifier: number) {
    this._identifier = identifier;
    this._devices = [];
  }

  public addDevice(device: Device) {
    this._devices.push(device);
  }


  get identifier(): number {
    return this._identifier;
  }

  get devices(): Device[] {
    return this._devices;
  }
}
