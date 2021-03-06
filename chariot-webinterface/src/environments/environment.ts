// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  version: "1.4",
  production: false,
  databaseUrl: 'http://chariot-km.dai-lab.de:8080/v1',
  monitoringServiceURL: 'http://chariot-km.dai-lab.de:8080/v1/monitoringservice/',
  serviceUrl: 'http://chariot-km.dai-lab.de:8080/v1/services/?format=json',
  // proxyAgentAddress: 'http://chariot-main.dai-lab.de:8080/chariot/sendAction',
  proxyAgentAddress: 'http://localhost:8080/chariot/sendAction',
  http_retries: 3,
  icons: {
    error: "error",
    warning: "warning"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
