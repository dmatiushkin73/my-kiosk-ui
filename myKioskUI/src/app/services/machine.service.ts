import { Injectable } from '@angular/core';
import { MACHINE_STATUS, WsMsgType } from '../models/wsmessage';
import { environment } from 'src/environments/environment';
import { Observable, Subject, interval } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { KEEPALIVE_INTERVAL, KEEPALIVE_TIMEOUT } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  private machineStatus: MACHINE_STATUS = MACHINE_STATUS.UNAVAILABLE;
  private machineStatus$: Subject<MACHINE_STATUS>;
  private keepAliveSimulation = true;
  private keepAliveTimeout: number;
 
  constructor(private wsService: WebsocketService) {
    this.machineStatus$ = new Subject<MACHINE_STATUS>();
    this.keepAliveTimeout = KEEPALIVE_TIMEOUT;
    
    if (environment.simulation) {
      this.wsService.simulateSequence([{
        messageType: WsMsgType.MACHINE_STATUS,
        status: MACHINE_STATUS.AVAILABLE
      }]);

      interval(KEEPALIVE_INTERVAL*1000).subscribe({
        next: (v) => {
          if (this.keepAliveSimulation) {
            this.wsService.simulateSequence([{
              messageType: WsMsgType.MACHINE_STATUS,
              status: MACHINE_STATUS.AVAILABLE
            }]);
          }
        }
      });
    }

    interval(2000).subscribe({
      next: (v) => {
        if (this.keepAliveTimeout > 0) {
          this.keepAliveTimeout -= 1;
          if (this.keepAliveTimeout == 0) {
            console.log("Machine KeepAlive timeout expired");
            this.machineStatus = MACHINE_STATUS.TIMEOUT;
            this.machineStatus$.next(MACHINE_STATUS.TIMEOUT);
          }
        }
      }
    });

    this.wsService.watchMachineStatus()
    .subscribe({
      next: (msg) => {
        this.keepAliveTimeout = KEEPALIVE_TIMEOUT;
        if (msg.status == MACHINE_STATUS.AVAILABLE) {
          this.machineStatus = MACHINE_STATUS.AVAILABLE;
          this.machineStatus$.next(MACHINE_STATUS.AVAILABLE);
        }
        else if (msg.status == MACHINE_STATUS.BUSY) {
          this.machineStatus = MACHINE_STATUS.BUSY;
          this.machineStatus$.next(MACHINE_STATUS.BUSY);
        }
        else if (msg.status == MACHINE_STATUS.ERROR) {
          this.machineStatus = MACHINE_STATUS.ERROR;
          this.machineStatus$.next(MACHINE_STATUS.ERROR);
        }
        else if (msg.status == MACHINE_STATUS.SWUPDATE) {
          this.machineStatus = MACHINE_STATUS.SWUPDATE;
          this.machineStatus$.next(MACHINE_STATUS.SWUPDATE);
        }
        else if (msg.status == MACHINE_STATUS.UNAVAILABLE) {
          this.machineStatus = MACHINE_STATUS.UNAVAILABLE;
          this.machineStatus$.next(MACHINE_STATUS.UNAVAILABLE);
        }
      }
    });
  }

  getMachineStatus(): MACHINE_STATUS {
    return this.machineStatus;
  }

  watchMachineStatus(): Subject<MACHINE_STATUS> {
    return this.machineStatus$;
  }

  stopKeepAliveSimulation() {
    this.keepAliveSimulation = false;
  }
}
