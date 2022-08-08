export const environment = {
  production: true,
  MQTT_SERVICE_OPTIONS: {
    hostname: '10.8.2.102',
    port: 15675,
    path: '/ws',
    username: 'aedev',
    password: 'a3d3v'
  },
  MQTT_TOPIC: 'welbit/data/crio/andon',
  URL_API: 'http://devsrv001.adriano-e.com:3200/api'
};
