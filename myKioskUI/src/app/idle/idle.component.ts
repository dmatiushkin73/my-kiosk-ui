import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { emerge } from '../app.animation';
import { WebsocketService } from '../services/websocket.service';
import { ConfigService } from '../services/config.service';
import { MachineService } from '../services/machine.service';
import { MACHINE_STATUS } from '../models/wsmessage';

@Component({
  selector: 'app-idle',
  templateUrl: './idle.component.html',
  styleUrls: ['./idle.component.scss'],
  animations: [
    emerge()
  ]
})
export class IdleComponent implements OnInit {

  private availableTitle = "Let's shop!";
  private unavailableTilte = "We apologize! Kiosk is currently unavailable";
  private enabled = true;
  text: string;

  constructor(private router: Router,
    private wsService: WebsocketService,
    private configService: ConfigService,
    private machineService: MachineService) {
      this.text = this.availableTitle;
  }

  ngOnInit(): void {
    console.log("IDLE");
    this.setState(this.machineService.getMachineStatus());
    this.machineService.watchMachineStatus()
    .subscribe({
      next: (ms) => {
        this.setState(ms);
      }
    });
    this.wsService.watchHumanDetected()
    .subscribe({
      next: (msg) => {
        if (msg.profileId && this.enabled) {
          this.configService.useProfile(msg.profileId.toString());
          this.router.navigate(['/home']);
        }
      }
    });
  }

  private setState(ms: MACHINE_STATUS) {
    if (ms != MACHINE_STATUS.AVAILABLE && ms != MACHINE_STATUS.BUSY) {
      this.text = this.unavailableTilte;
      this.enabled = false;
    }
    else {
      this.text = this.availableTitle;
      this.enabled = true;
    }
  }

  onTouch() {
    if (this.enabled) {
      this.configService.useDefaultProfile();
      this.router.navigate(['/home']);
    }
  }

}
