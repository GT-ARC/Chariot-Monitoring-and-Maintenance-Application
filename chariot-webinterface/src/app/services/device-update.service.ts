import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceUpdateService {

  apiURL = "http://chariot-km.dai-lab.de";

  constructor() { }
}
