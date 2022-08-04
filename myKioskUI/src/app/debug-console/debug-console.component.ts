import { Component, OnInit } from '@angular/core';
import { Form, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { flyInOut } from '../app.animation';
import { GlobalsService } from '../services/globals.service';
import { WebsocketService } from '../services/websocket.service';
import { INACTIVITY_TIME } from '../app.constants';
import { WsMsgType } from '../models/wsmessage';
import { MachineService } from '../services/machine.service';

@Component({
  selector: 'app-debug-console',
  templateUrl: './debug-console.component.html',
  styleUrls: ['./debug-console.component.scss'],
  animations: [
    flyInOut()
  ]
})
export class DebugConsoleComponent implements OnInit {

  isVisible = false;
  dbgCommand: FormControl;

  constructor(private iconRegistry: MatIconRegistry,
      private sanitizer: DomSanitizer,
      private globalsService: GlobalsService,
      private wsService: WebsocketService,
      private machineSercice: MachineService) {
    iconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/close.svg'));
    iconRegistry.addSvgIcon('ok', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/check.svg'));
    this.dbgCommand = new FormControl('', []);
  }

  ngOnInit(): void {
    this.globalsService.watchDebugConcoleVisibility()
    ?.subscribe({
      next: (v) => {
        this.isVisible = v;
        if (!v) {
          this.dbgCommand.setValue("");
        }
      }
    });
  }

  onExec() {
    const cmd: string = this.dbgCommand.value;
    var beClosed = false;
    if (cmd && cmd.length > 0) {
      const items = cmd.split(' ');
      const itnum = items.length;
      beClosed = true;
      if (items[0] == "ws") {
        if (itnum >= 3 && items[1] == "hd") {
          console.log("Debug command: Human detected, profile " + items[2]);
          setTimeout(() => {
            this.wsService.simulateSequence([{
              messageType: WsMsgType.HUMAN_DETECTED,
              profileId: parseInt(items[2])
            }]);
          }, (INACTIVITY_TIME+5)*1000);
        }
        else if (itnum >=2 && items[1] == "bu") {
          console.log("Debug command: Brand Info updated");
          setTimeout(() => {
            this.wsService.simulateSequence([{
              messageType: WsMsgType.BRAND_INFO_UPDATED
            }]);
          }, 100);
        }
        else if (itnum >=2 && items[1] == "mu") {
          console.log("Debug command: UI Model updated");
          setTimeout(() => {
            this.wsService.simulateSequence([{
              messageType: WsMsgType.UI_MODEL_UPDATED
            }]);
          }, 100);
        }
        else if (itnum >= 3 && items[1] == "ms") {
          console.log("Debug command: new Machine Status = " + items[2]);
          setTimeout(() => {
            this.wsService.simulateSequence([{
              messageType: WsMsgType.MACHINE_STATUS,
              status: items[2]
            }]);
          }, 1000);
        }
        else if (itnum >=2 && items[1] == "tm") {
          console.log("Debug command: websocket timeout");
          this.machineSercice.stopKeepAliveSimulation();
        }
        else {
          console.log("Unknown debug command - " + cmd);
          beClosed = false;
        }
      }
      else {
        console.log("Unknown debug command - " + cmd);
        beClosed = false;
      }
    }
    if (beClosed) {
      this.globalsService.hideDebugConsole();
    }
  }

  onClose() {
    this.globalsService.hideDebugConsole();
  }
}
