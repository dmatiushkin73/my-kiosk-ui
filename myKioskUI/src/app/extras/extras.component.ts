import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../services/globals.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.scss']
})
export class ExtrasComponent implements OnInit {

  dbgBtnEnabled: boolean;

  constructor(private globalsService: GlobalsService) { 
    this.dbgBtnEnabled = environment.simulation;
  }

  ngOnInit(): void {
  }

  onPolicyClick() {

  }

  onContactsClick() {
    this.globalsService.showContacts();
  }

  onDebugClick() {
    this.globalsService.showDebugConsole();
  }
}
