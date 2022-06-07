import { Injectable } from '@angular/core';
import { UI_MODE } from '../app.constants';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

  private displayId: string = "";
  private uiMode: UI_MODE = UI_MODE.INITIALIZATION;
  
  private httpWriteOptions = {};
  private httpReadOptions = {};

  constructor() { }

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
}
