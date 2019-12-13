import {Device} from './device';

export class DeviceGroup {

  private readonly _identifier : string;
  private readonly _devices : Device[];
  private readonly _name: string;
  private _visible: boolean = Math.random() > 0.5;

  constructor(identifier: string, name: string) {
    this._identifier = identifier;
    this._name = name;
    this._devices = [];
  }

  public addDevice(device: Device) {
    this._devices.push(device);
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  get name(): string {
    return this._name;
  }

  get identifier(): string {
    return this._identifier;
  }

  get devices(): Device[] {
    return this._devices;
  }
}
