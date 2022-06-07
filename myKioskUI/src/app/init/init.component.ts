import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalsService } from '../services/globals.service';
import { MACHINE_STATUS, UI_MODE } from '../app.constants';
import { MachineService } from '../services/machine.service';
import { PreviousRouteService } from '../services/previous-route.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private globalsService: GlobalsService,
    private machineService: MachineService,
    private router: Router,
    private prevRouteService: PreviousRouteService) { }

  ngOnInit(): void {
    this.globalsService.setDisplayId(this.route.snapshot.params['id']);
    this.machineService.watchMachineStatus().subscribe({
      next: (v) => {
        if (v === MACHINE_STATUS.AVAILABLE) {
          this.globalsService.setUiMode(UI_MODE.VENDING);
          this.router.navigate(['/idle']);
        }
      }
    });
  }

}
