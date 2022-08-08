// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  MQTT_SERVICE_OPTIONS: {
    hostname: '10.8.2.102',
    port: 15675,
    path: '/ws',
    username: 'aedev',
    password: 'a3d3v'
  },
  MQTT_TOPIC: 'welbit/data/crio/andon',
  URL_API: 'http://localhost:3200/api'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
