import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AgentUpdateService {

  constructor() { }

  public static sendUpdate(url: string, value: any) {
    console.log(url, value);
  }

}
