import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  url: string = "http://chariot-km.dai-lab.de:8001";
  testURL: String = "https://jsonplaceholder.typicode.com/";

  constructor(private http: HttpClient) { }

  getDeviceData() {
    return this.http.get(this.testURL + "todos/")
  }


}
