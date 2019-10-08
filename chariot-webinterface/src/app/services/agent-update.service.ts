import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AgentUpdateService {

  proxyAgentAddress: string = 'http://chariot-main.dai-lab.de:8080/chariot/ProxyAgent/sendAction';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) {
  }

  public sendUpdate(deviceID: string, value: any) {
    let message = {
      device_id: JSON.stringify(deviceID),
      value: JSON.stringify(JSON.stringify(value))
    };

    console.log(JSON.stringify(message));

    this.http.post(this.proxyAgentAddress, JSON.stringify(message), this.httpOptions).subscribe( data =>
      console.log(data)
    );
  }

}
