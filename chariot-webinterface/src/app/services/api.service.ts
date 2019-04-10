import { Injectable } from '@angular/core';
import { HttpClient} from  '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_URL  =  'http://192.168.180.103:32417/sd-rest/';
  //API_URL  =  'http://localhost:8080';

  constructor(private  httpClient:  HttpClient) {}

  getDeviceById(id: string){
    return  this.httpClient.get(`${this.API_URL}/sco/${id}`);
  }
}
