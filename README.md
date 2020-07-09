# MM Application
​
The Maintenance and Management App (MM-App) and the Production Planning and Monitoring App (PPM-App) were developed as a single application, MM-App. The first part of the application, shown in Figure 1.5.1 for device monitoring, shows the selected device or device group. Each device interface is individually tailored to the device with all the sensors and actuators that can be integrated. The second area, shown in Figure 1.5.2 for the visualization of the monitoring and control of the product to be manufactured, shows the process and progress of the product as well as other product information. Furthermore, it displays stored products in the Container Service with the possibility to sort by the individual properties. However, this app is not limited to this use case, but can be adapted for many IoT scenarios.

## Comunication ##

![Comunication Chart](/FrontendCommunication.png)

## Folder Structure ##

```
.
├── Assets
│   ├── Icons
│   └── RubikFont
├── chariot-mm-app.iml
├── chariot-webinterface                 <------- The main frontend folder
│   ├── angular.json
│   ├── buildEventLog
│   ├── chariot-webinterface.iml
│   ├── Dockerfile
│   ├── e2e
│   ├── log-normal.txt
│   ├── log-prod.txt
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── src
│   ├── tsconfig.json
│   └── tslint.json
├── docker-compose.yml
├── dockerfiles
│   └── Dockerfile
├── FrontendCommunication.drawio
├── kafkaProducer                       <------- In Phython written mock kafka producer that pushes data through the backend
│   ├── Dockerfile
│   ├── KafkaProducerTest.py
│   └── start.bat
├── nodejs-backend                      <------- The backend
│   ├── Dockerfile
│   ├── log.txt
│   ├── package.json
│   ├── package-lock.json
│   └── src
├── README.md
└── test-devices                        <------- Jiac testig devices
    ├── pom.xml
    └── src
```

### nodejs-backend
​
This module establishes a connection between kafka broker and the frond-end. The devices and their properties subscribe themselves through the functionality provided in this software. Once a message is received from the kafka-broker, the message is forwarded to the topic of the entity/device.
​
The most important function is `socket.on ('subscribe')`through which a user sends a subscription message with its kafka topic. For each usser a`customer` object is created and the incoming messages are handled in `consumer.run` function.

### Design Mockup

https://marvelapp.com/59g410f/screen/53114304
 
### dockerfiles
​
The whole project runs in a docker container and this folder includes the docker configuration file. The exposed port is `80`, so the front-end is published on 80 port.

### test-devices  
​
This software simulates the devices and sends the data as a kafka-producer. While ExampleTestDevice creates a simple device agent, `Kafkahelper` creates a kafka producer and sends data to the given topic. For each device property a topic is created and the values of those properties are periodically sent through Kafkahelper to the broker. HttpClient is only used to register a client in the kms-database. Note that the written urls or configration related values might be outdated.


### Configuration Files  
​
`Dockerfile`: dockerize the application.  
​
`angularjs.json`: provides some functioalities to configure, to serve, to test e2e.  
​
`tsconfig.json`  
​
`pakcage.json`: all library dependecies are added in this file.  
​
`tslint.json`: custome defined lint rules specific to type script language  


### App-routing and updating the links 
​
The routing folder is edited in `app-routing`, which means, when you add a new 
component and you want to link it, this is the page that you have to edit. 
Simple usage: import the module -> add to the routes -> export it
​
```javascript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import {DevicesComponent} from "./devices/devices.component";
// impor your module
const routes: Routes = [
...
  { path: 'devices',      component: DevicesComponent },
  // add your module
...
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

```

For each view in the web page, a component is composed under the app folder.   
`services` is  mostly responsbile for backend communications.  
Each module is composed four files, namely, .css, .html, .ts.  

### Extending with new modules or libs
​
`app-module` inherits all required libraries. If you intend to add a new lib, then import the lib from its location, put it under `declerations` if it is your implemented component, otherwise put it under `imports`object.  

`app.component.ts` is the main component where the initiation of the app occurs. `ngOnInit` function initiates the component and the whole view is loaded under this function. First the data is called via `restService.getDEviceData`. `subscribe` method is used for the promises in javascript. The whole action happens under this call.   

In order to add `warehouse`and `production-planing` scenario, we need to add right under this call by calling their related services to be implemented.  

## Quick Tutorial & Dev Onboarding

* Install nodejs (optional: set global location non-root)
* https://angular.io/guide/quickstart

