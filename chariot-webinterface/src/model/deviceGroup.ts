import {Device} from './device';

export class DeviceGroup {

  private readonly _identifier : string;
  private _devices : Device[];
  private _name: string;
  private _unfolded: boolean = Math.random() > 0.5;

  constructor(identifier: string, name: string) {
    this._identifier = identifier;
    this._name = name;
    this._devices = [];
  }

  public addDevice(device: Device) {
    this._devices.push(device);
  }

  get unfolded(): boolean {
    return this._unfolded;
  }

  set unfolded(value: boolean) {
    this._unfolded = value;
  }

  set devices(value: Device[]) {
    this._devices = value;
  }
  set name(value: string) {
    this._name = value;
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
