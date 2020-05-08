import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, retry} from "rxjs/operators";
import {NotifierService} from "angular-notifier";
import {DataHandlingService} from "./data-handling.service";

@Injectable({
  providedIn: 'root'
})
export class RestService {

  currentMonitoringService: string = "";
  mappingObserv = new EventEmitter<{deviceID : String, agentID: String} []>();

  constructor(private http: HttpClient,
              private notifierService: NotifierService) {
  }

  getHistoryData(url: string) : Observable<Object> {
    // console.log("Receive data: " + url);
    return this.http.get(url + "history/")
      .pipe(
        retry(environment.http_retries),
        catchError(err => this.handleError(err))
      );
  }

  getContainer() {
    let header: HttpHeaders = new HttpHeaders();
    header.append("Access-Control-Allow-Origin", "*");
    return this.http
      .get(environment.databaseUrl + "/products/", {headers: header})
      .pipe(
        retry(environment.http_retries),
        catchError(err => this.handleError(err))
      );
  }

  getDeviceData(): Observable<Object> {
    let header: HttpHeaders = new HttpHeaders();
    header.append("Access-Control-Allow-Origin", "*");
    return this.http.get(environment.databaseUrl + "/devices/", {headers: header})
      .pipe(
        retry(environment.http_retries),
        catchError(err => this.handleError(err))
      );
  }

  getServices() {
    let header: HttpHeaders = new HttpHeaders();
    header.append("Access-Control-Allow-Origin", "*");
    return this.http.get(environment.databaseUrl + "/services/", {headers: header})
      .pipe(
        retry(environment.http_retries),
        catchError(err => this.handleError(err))
      );
  }

  getDeviceMapping(): Observable<{deviceID : String, agentID: String}[]> {
    this.http.get(environment.monitoringServiceURL).subscribe(data => {
      if (Array.isArray(data) && data.length != 0) {
        let monitoringService = data[0]['agentlist'];
        this.currentMonitoringService = monitoringService['url'];
        // console.log(this.currentMonitoringService);

        let mapping: {deviceID : String, agentID: String} [] = [];

        let mappings = monitoringService['mappings'];
        for(let element of mappings) {
          mapping.push({
            deviceID : element['device_id'],
            agentID : element['agent_id']
          });
        }

        this.mappingObserv.emit(mapping);
      }
    });
    return this.mappingObserv.asObservable();
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status} Message: ${error.message}`;
    }
    this.notifierService.notify('error', errorMessage);
    // window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
