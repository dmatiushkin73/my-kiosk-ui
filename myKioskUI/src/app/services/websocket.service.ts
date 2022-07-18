import { Injectable } from '@angular/core';
import { WsMsgType, WsMessage } from '../models/wsmessage';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { GlobalsService } from './globals.service';
import { environment } from 'src/environments/environment';
import { repeat, retry, Subject, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private ws$?: WebSocketSubject<WsMessage>;
  private humanDetected$: Subject<WsMessage>;
  private configUpdated$: Subject<WsMessage>;
  private dispensingStatusChanged$: Subject<WsMessage>;
  private machineStatusChanged$: Subject<WsMessage>;
  private simulatedMessages: WsMessage[];
  private simulatedIndex = 0;
  private simulationInProgress = false;

  constructor(private globalService: GlobalsService) { 
    this.humanDetected$ = new Subject<WsMessage>();
    this.configUpdated$ = new Subject<WsMessage>();
    this.dispensingStatusChanged$ = new Subject<WsMessage>();
    this.machineStatusChanged$ = new Subject<WsMessage>();
    this.simulatedMessages = [];

    if (environment.simulation) {
      interval(5000).subscribe({
        next: (v) => {
          if (this.simulationInProgress && this.simulatedMessages) {
            if (this.simulatedIndex < this.simulatedMessages.length) {
              this.processMessage(this.simulatedMessages[this.simulatedIndex]);
              this.simulatedIndex++;
              if (this.simulatedIndex >= this.simulatedMessages.length) {
                this.simulationInProgress = false;
              }
            }
          }
        }
      });
    }
  }

  init() {
    if (!environment.simulation) {
      if (this.ws$) {
        this.ws$.complete();
      }
      this.ws$ = webSocket(environment.wsServerUrl + '?displayId=' + this.globalService.getDisplayId());
      this.ws$.pipe(retry(), repeat())
      .subscribe({
        next: (msg) => {
          this.processMessage(msg);
        }
      });
    }
  }

  private processMessage(msg: WsMessage) {
    if (msg.messageType == WsMsgType.HUMAN_DETECTED) {
      this.humanDetected$.next(msg);
    }
    else if (msg.messageType == WsMsgType.BRAND_INFO_UPDATED || msg.messageType == WsMsgType.UI_MODEL_UPDATED) {
      this.configUpdated$.next(msg);
    }
    else if (msg.messageType == WsMsgType.DISPENSING_STATUS) {
      this.dispensingStatusChanged$.next(msg);
    }
    else if (msg.messageType == WsMsgType.MACHINE_STATUS) {
      this.machineStatusChanged$.next(msg);
    }
    else {
      console.log("Message of unknown type received from Websocket: ", msg);
    }
  }

  watchHumanDetected(): Subject<WsMessage> {
    return this.humanDetected$;
  }

  watchConfigChange(): Subject<WsMessage> {
    return this.configUpdated$;
  }

  watchDispensingStatus(): Subject<WsMessage> {
    return this.dispensingStatusChanged$;
  }

  watchMachineStatus(): Subject<WsMessage> {
    return this.machineStatusChanged$;
  }

  simulateSequence(seq: WsMessage[]) {
    this.simulatedMessages = seq;
    this.simulatedIndex = 0;
    this.simulationInProgress = true;
  }
}
