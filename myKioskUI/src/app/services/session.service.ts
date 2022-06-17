import { Injectable } from '@angular/core';
import { INACTIVITY_TIME, MACHINE_STATUS, UI_MODE } from '../app.constants';
import { interval, fromEvent, filter } from 'rxjs';
import { CartService } from './cart.service';
import { MachineService } from './machine.service';
import { GlobalsService } from './globals.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  inactivityCnt: number = INACTIVITY_TIME;
  inactivityEnabled = false;

  constructor(private cartService: CartService,
    private machineService: MachineService,
    private globalsService: GlobalsService,
    private router: Router) {
    interval(1000).subscribe({
      next: (v) => {
        if (this.inactivityEnabled) {
          this.inactivityCnt -= 1;
          if (this.inactivityCnt <= 0) {
            this.inactivityEnabled = false;
            this.onSessionEnd();
          }
        }
      }
    });
    
    fromEvent(document, 'click').pipe(
      filter(() => this.machineService.getMachineStatus() == MACHINE_STATUS.AVAILABLE && 
        this.globalsService.getUiMode() == UI_MODE.VENDING &&
        this.inactivityEnabled),
    ).subscribe(event => {
      this.inactivityCnt = INACTIVITY_TIME;
    });
  }

  private onSessionEnd() {
    this.cartService.clearCart();
    this.router.navigate(['/idle']);
  }

  startSession() {
    this.inactivityCnt = INACTIVITY_TIME;
    this.inactivityEnabled = true;
  }
}
