import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../services/globals.service';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.scss']
})
export class ExtrasComponent implements OnInit {

  constructor(private globalsService: GlobalsService) { }

  ngOnInit(): void {
  }

  onPolicyClick() {

  }

  onContactsClick() {
    this.globalsService.showContacts();
  }
}
