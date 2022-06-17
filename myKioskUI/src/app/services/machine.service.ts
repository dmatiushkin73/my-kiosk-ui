import { Injectable } from '@angular/core';
import { MACHINE_STATUS } from '../app.constants';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  private machineStatus: MACHINE_STATUS = MACHINE_STATUS.UNAVAILABLE;
  private machineStatus$: Subject<MACHINE_STATUS>;
 
  constructor() {
    this.machineStatus$ = new Subject<MACHINE_STATUS>();
    
    if (environment.simulation) {
      setTimeout(() => { this.machineStatus = MACHINE_STATUS.AVAILABLE;
        this.machineStatus$.next(this.machineStatus);
      }, 4000);
    }
  }

  getMachineStatus(): MACHINE_STATUS {
    return this.machineStatus;
  }

  watchMachineStatus(): Subject<MACHINE_STATUS> {
    return this.machineStatus$;
  }
}
