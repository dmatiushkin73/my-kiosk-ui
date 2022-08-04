import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalsService } from '../services/globals.service';
import { UI_MODE } from '../app.constants';
import { MACHINE_STATUS } from '../models/wsmessage';
import { MachineService } from '../services/machine.service';
import { WebsocketService } from '../services/websocket.service';
import { PreviousRouteService } from '../services/previous-route.service';
import { ConfigService } from '../services/config.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private globalsService: GlobalsService,
    private wsService: WebsocketService,
    private machineService: MachineService,
    private router: Router,
    private prevRouteService: PreviousRouteService, // Put it here to let it be creaated at this point
    private configService: ConfigService) { }

  ngOnInit(): void {
    this.globalsService.setDisplayId(this.route.snapshot.params['id']);
    this.wsService.init();
    this.configService.init();
    this.machineService.watchMachineStatus().pipe(take(1)).subscribe({
      next: (v) => {
        if (v === MACHINE_STATUS.AVAILABLE) {
          this.globalsService.setUiMode(UI_MODE.VENDING);
          this.router.navigate(['/idle']);
        }
      }
    });
  }

}
