import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {settings} from "../../environments/default_settings";

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
    message["inputs"] = {};
    message["inputs"][propertyName] = propertyValue;
    this.sendMessageToProxy(message);
  }

  public sendJson(deviceID: string, json: string) {
    let message = {};
    message["command"] = "property-state-change";
    message["uuid"] = deviceID;
    message["json"] = json;
    this.sendMessageToProxy(message);
  }

  private sendMessageToProxy(message) {
    console.log("Send message to proxy agent: ", JSON.stringify(message));

    if( settings.general.find(ele => ele.name == 'Mock modus').value){
      this.notifierService.notify('success', 'device: ' + message["uuid"] + ' updated')
    } else {
      this.http.post(environment.proxyAgentAddress, JSON.stringify(message), this.httpOptions)
        .pipe(
          catchError(err => this.handleError(err, this.notifierService))
        ).subscribe(data => this.notifierService.notify('success', 'device: ' + message["uuid"] + ' updated'));
    }
  }

  handleError(error, notifyService) {
    if (error.error.code) {
      notifyService.notify('error', 'code: ' + error.error.code + ' - ' + error.error.message);
    } else
      notifyService.notify('error', 'code: ' + error.statusText);

    return throwError(error);
  }

}
