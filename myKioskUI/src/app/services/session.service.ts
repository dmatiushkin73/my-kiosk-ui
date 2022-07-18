import { Injectable } from '@angular/core';
import { INACTIVITY_TIME, UI_MODE, TRANSACTION_LIFE_TIME } from '../app.constants';
import { MACHINE_STATUS } from '../models/wsmessage';
import { interval, fromEvent, filter } from 'rxjs';
import { CartService } from './cart.service';
import { MachineService } from './machine.service';
import { GlobalsService } from './globals.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

class TransactionCount {
  private cnt = 0;
  private enabled = false;
  private cnt$: Subject<number>;

  constructor() {
    this.cnt$ = new Subject<number>();
  }

  public start() {
    this.cnt = TRANSACTION_LIFE_TIME;
    this.enabled = true;
    this.cnt$.next(this.cnt);
  }

  public stop() {
    this.enabled = false;
  }

  public onTick() {
    if (this.enabled && this.cnt > 0) {
      this.cnt -= 1
      this.cnt$.next(this.cnt);
    }
  }

  public watch(): Subject<number> {
    return this.cnt$;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  inactivityCnt: number = INACTIVITY_TIME;
  inactivityEnabled = false;
  transactionCnt: TransactionCount;

  constructor(private cartService: CartService,
    private machineService: MachineService,
    private globalsService: GlobalsService,
    private router: Router) {
    this.transactionCnt = new TransactionCount();

    interval(1000).subscribe({
      next: (v) => {
        if (this.inactivityEnabled) {
          this.inactivityCnt -= 1;
          if (this.inactivityCnt <= 0) {
            this.inactivityEnabled = false;
            this.onSessionEnd();
          }
        }
        this.transactionCnt.onTick();
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
    if (environment.inactivity) {
      this.inactivityCnt = INACTIVITY_TIME;
      this.inactivityEnabled = true;
    }
  }

  stopSession() {
    this.inactivityEnabled = false;
  }

  startTransactionCoundDown() {
    this.transactionCnt.start();
  }

  stopTransactionCountDown() {
    this.transactionCnt.stop();
  }

  watchTransactionCountDown(): Subject<number> {
    return this.transactionCnt.watch();
  }
}
