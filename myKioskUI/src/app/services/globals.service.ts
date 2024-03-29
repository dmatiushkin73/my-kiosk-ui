import { Injectable } from '@angular/core';
import { UI_MODE } from '../app.constants';
import { HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

  private displayId: string = "";
  private uiMode: UI_MODE = UI_MODE.INITIALIZATION;
  
  private httpWriteOptions = {};
  private httpReadOptions = {};

  private contactsVisibility$: Subject<boolean>;
  private debugConsoleVisibility$?: Subject<boolean>;

  constructor() { 
    this.contactsVisibility$ = new Subject<boolean>();
    if (environment.simulation) {
      this.debugConsoleVisibility$ = new Subject<boolean>();
    }
  }

  setDisplayId(id: string) {
    this.displayId = id;
    this.httpReadOptions = {
      headers: new HttpHeaders({
        'displayId': id
      })
    };
    this.httpWriteOptions = {
      headers: new HttpHeaders({
        'displayId': id, 
        'Content-Type': 'application/json'
      })
    };
    console.log("My display id=" + id);
  }

  getDisplayId(): string {
    return this.displayId;
  }

  getUiMode(): UI_MODE {
    return this.uiMode;
  }

  setUiMode(mode: UI_MODE) {
    this.uiMode = mode;
  }

  getHttpReadOptions() {
    return this.httpReadOptions;
  }

  getHttpWriteOptions() {
    return this.httpWriteOptions;
  }

  showContacts() {
    this.contactsVisibility$.next(true);
  }

  hideContacts() {
    this.contactsVisibility$.next(false);
  }

  watchContactsVisibility(): Subject<boolean> {
    return this.contactsVisibility$;
  }

  showDebugConsole() {
    if (this.debugConsoleVisibility$) {
      this.debugConsoleVisibility$.next(true);
    }
  }

  hideDebugConsole() {
    if (this.debugConsoleVisibility$) {
      this.debugConsoleVisibility$.next(false);
    }
  }

  watchDebugConcoleVisibility(): Subject<boolean> | undefined {
    return this.debugConsoleVisibility$;
  }
}
