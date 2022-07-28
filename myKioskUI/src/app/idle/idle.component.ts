import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { emerge } from '../app.animation';
import { WebsocketService } from '../services/websocket.service';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-idle',
  templateUrl: './idle.component.html',
  styleUrls: ['./idle.component.scss'],
  animations: [
    emerge()
  ]
})
export class IdleComponent implements OnInit {

  text: string = "Let's shop!";

  constructor(private router: Router,
    private wsService: WebsocketService,
    private configService: ConfigService) { }

  ngOnInit(): void {
    console.log("IDLE");
    this.wsService.watchHumanDetected()
    .subscribe({
      next: (msg) => {
        if (msg.profileId) {
          this.configService.useProfile(msg.profileId.toString());
          this.router.navigate(['/home']);
        }
      }
    });
  }

  onTouch() {
    this.configService.useDefaultProfile();
    this.router.navigate(['/home']);
  }

}
