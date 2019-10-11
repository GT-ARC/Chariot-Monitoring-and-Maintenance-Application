import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentUpdateService {

  proxyAgentAddress: string = 'http://chariot-main.dai-lab.de:8080/chariot/sendAction';
  // proxyAgentAddress: string = 'http://localhost:8080/chariot/sendAction';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private notifierService: NotifierService
  ) {
  }

  public sendUpdate(deviceID: string, value: any) {
    let message = {
      device_id: deviceID,
      value: value
    };

    console.log(JSON.stringify(message));


    this.http.post(this.proxyAgentAddress, JSON.stringify(message), this.httpOptions)
      .pipe(
        catchError(err => this.handleError(err, this.notifierService))
      ).subscribe(data => this.notifierService.notify('success', 'device-updated'));
  }

  handleError(error, notifyService) {
    notifyService.notify('error', 'code: ' + error.error.code + ' - ' + error.error.message);
    return throwError(error);
  }

}
