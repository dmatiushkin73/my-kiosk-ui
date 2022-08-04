import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { ConfigService } from '../services/config.service';
import { flyInOutLeft } from '../app.animation';
import { GlobalsService } from '../services/globals.service';

export interface ContactTile {
  rows: number;
  cols: number;
  withText: boolean;
  text: string;
  withIcon: boolean;
  iconName: string;
  classname: string;
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  animations: [
    flyInOutLeft()
  ]
})
export class ContactsComponent implements OnInit {

  tiles?: ContactTile[];
  isVisible = false;

  constructor(private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private configService: ConfigService,
    private globalsSerice: GlobalsService) { 
      iconRegistry.addSvgIcon('phone', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/phone.svg'));
      iconRegistry.addSvgIcon('email', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/email.svg'));
  }

  ngOnInit(): void {
    this.globalsSerice.watchContactsVisibility()
    .subscribe({
      next: (v) => {
        if (v) {
          this.buildTiles();
        }
        this.isVisible = v;
      }
    });
  }

  private buildTiles() {
    const contacts = this.configService.getContacts();
    if (contacts.length > 0) {
      this.tiles = [];
      for (const contact of contacts) {
        this.tiles.push({
          rows: 2,
          cols: 5,
          withText: true,
          text: contact.department,
          withIcon: false,
          iconName: "",
          classname: "tile-dep-title"
        });
        this.tiles.push({
          rows: 1,
          cols: 1,
          withText: false,
          text: "",
          withIcon: true,
          iconName: "phone",
          classname: "tile-dep-props"
        });
        this.tiles.push({
          rows: 1,
          cols: 6,
          withText: true,
          text: contact.phone,
          withIcon: false,
          iconName: "",
          classname: "tile-dep-props"
        });
        this.tiles.push({
          rows: 1,
          cols: 1,
          withText: false,
          text: "",
          withIcon: true,
          iconName: "email",
          classname: "tile-dep-props"
        });
        this.tiles.push({
          rows: 1,
          cols: 6,
          withText: true,
          text: contact.email,
          withIcon: false,
          iconName: "",
          classname: "tile-dep-props"
        });
      }
    }
    else {
      this.tiles = undefined;
    }
  }

  onCloseClick() {
    this.globalsSerice.hideContacts();
  }
}
