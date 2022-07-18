import { Injectable } from '@angular/core';
import { MACHINE_STATUS, WsMsgType } from '../models/wsmessage';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  private machineStatus: MACHINE_STATUS = MACHINE_STATUS.UNAVAILABLE;
  private machineStatus$: Subject<MACHINE_STATUS>;
 
  constructor(private wsService: WebsocketService) {
    this.machineStatus$ = new Subject<MACHINE_STATUS>();
    
    if (environment.simulation) {
      this.wsService.simulateSequence([{
        messageType: WsMsgType.MACHINE_STATUS,
        status: MACHINE_STATUS.AVAILABLE
      }]);

      this.wsService.watchMachineStatus()
      .subscribe({
        next: (msg) => {
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
  }

  getMachineStatus(): MACHINE_STATUS {
    return this.machineStatus;
  }

  watchMachineStatus(): Subject<MACHINE_STATUS> {
    return this.machineStatus$;
  }
}
