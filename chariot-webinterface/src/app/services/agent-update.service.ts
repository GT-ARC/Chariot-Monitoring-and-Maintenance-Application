import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentUpdateService {

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

  public sendUpdate(deviceID: string, propertyName: any, propertyValue: any) {
    let message = {};
    message["command"] = "property-state-change";
    message["uuid"] = deviceID;
    message["inputs"] = {
      propertyName: propertyValue
    };

    console.log("Send message to proxy agent: ", JSON.stringify(message));

    this.notifierService.notify('success', 'device: ' + message["uuid"] + ' updated')

    // this.http.post(environment.proxyAgentAddress, JSON.stringify(message), this.httpOptions)
    //   .pipe(
    //     catchError(err => this.handleError(err, this.notifierService))
    //   ).subscribe(data => this.notifierService.notify('success', 'device-updated'));
  }

  handleError(error, notifyService) {
    notifyService.notify('error', 'code: ' + error.error.code + ' - ' + error.error.message);
    return throwError(error);
  }

}
