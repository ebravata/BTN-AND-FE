import { Injectable } from '@angular/core';
import { ping } from '@network-utils/tcp-ping';


@Injectable({
  providedIn: 'root'
})
export class PingMonitorService {

  constructor( ) {}

  enviarPing = ping({
      address: '192.168.1.47',
      attempts: 10,
      port: 80,
      timeout: 3000
      }, this.update).
            then(result => {
                console.log('ping result:', result)
  
  
                // //ping result:
                // {
                //   averageLatency: 19.2753,
                //   errors: [
                //     {
                //       // Which attempt failed
                //       attempt: 3,
                //       error: Error('Request timeout')
                //     }
                //   ],
                //   maximumLatency: 35.1978,
                //   minimumLatency: 3.7716,
                //   options: {
                //     address: '192.168.1.47',
                //     attempts: 10,
                //     port: 80,
                //     timeout: 3000
                //   }
                // }
            });
  
   update (progress: any, total: any) {
    console.log(progress, '/', total)
    /*
      1 / 10
      2 / 10
      3 / 10
      ...
    */
  }
}
